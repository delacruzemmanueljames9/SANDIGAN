"use client";

import * as React from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { Profile, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, displayName: string, isMinor?: boolean) => Promise<{ error?: string; needsEmailVerification?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [role, setRole] = React.useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const supabase = React.useMemo(() => getSupabaseBrowserClient(), []);

  const loadUserProfile = React.useCallback(async (userId: string, userEmail?: string, appMetadata?: Record<string, unknown>) => {
    try {
      // 1. Fetch Profile
      const { data: profData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (profData) {
        setProfile({
          id: profData.id,
          email: userEmail,
          display_name: profData.display_name,
          avatar_url: profData.avatar_url,
          role: "user",
          is_minor: profData.is_minor,
          preferred_language: profData.preferred_language || "en",
          created_at: profData.created_at,
          updated_at: profData.updated_at,
        });
      } else {
        // Fallback display if database trigger hasn't populated yet
        setProfile({
          id: userId,
          email: userEmail,
          display_name: userEmail?.split("@")[0] || "User",
          role: "user",
          preferred_language: "en",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // 2. Fetch User Role strictly from user_roles table or verified app_metadata
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      const validRoles: UserRole[] = ["user", "volunteer", "moderator", "counselor", "founder", "admin"];
      const metaRole = appMetadata?.role as UserRole | undefined;

      if (roleData && roleData.role && validRoles.includes(roleData.role as UserRole)) {
        const verifiedRole = roleData.role as UserRole;
        setRole(verifiedRole);
        setProfile((prev) => (prev ? { ...prev, role: verifiedRole } : null));
      } else if (metaRole && validRoles.includes(metaRole)) {
        setRole(metaRole);
        setProfile((prev) => (prev ? { ...prev, role: metaRole } : null));
      } else {
        setRole("user");
      }
    } catch {
      setRole("user");
    }
  }, [supabase]);

  React.useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            await loadUserProfile(initialSession.user.id, initialSession.user.email, initialSession.user.app_metadata);
          } else {
            setProfile(null);
            setRole(null);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        await loadUserProfile(newSession.user.id, newSession.user.email, newSession.user.app_metadata);
      } else {
        setProfile(null);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadUserProfile]);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    } catch (err: unknown) {
      return { error: (err as Error).message || "An unexpected error occurred during sign in." };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    isMinor: boolean = false
  ): Promise<{ error?: string; needsEmailVerification?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            is_minor: isMinor,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) return { error: error.message };
      const needsEmailVerification = !data.session;
      return { needsEmailVerification };
    } catch (err: unknown) {
      return { error: (err as Error).message || "An unexpected error occurred during registration." };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  };

  const resetPassword = async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: unknown) {
      return { error: (err as Error).message || "Failed to send password reset email." };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
