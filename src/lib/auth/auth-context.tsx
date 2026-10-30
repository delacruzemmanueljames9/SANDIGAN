'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/types';
import { initialProfiles } from '@/lib/store/tk-store';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface AuthContextType {
  currentUser: UserProfile;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isHQAuthorized: boolean;
  switchRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  loginAsDemoUser: (email: string) => void;
  logout: () => void;
  availableProfiles: UserProfile[];
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Super Admin (Founder) for seamless exploration, but easily toggleable
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tk_current_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return initialProfiles[0]; // Emmanuel James (super_admin)
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tk_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Check if Supabase session is active
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        const found = initialProfiles.find(p => p.email === session.user.email);
        if (found) {
          setCurrentUser(found);
        } else {
          setCurrentUser({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || 'TK Registered User',
            role: 'public_user',
            status: 'active',
            created_at: new Date().toISOString(),
          });
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        const found = initialProfiles.find(p => p.email === session.user.email);
        if (found) {
          setCurrentUser(found);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const switchRole = (role: UserRole) => {
    // Find matching profile for this role or construct appropriate one
    const matching = initialProfiles.find(p => p.role === role);
    if (matching) {
      setCurrentUser(matching);
    } else {
      setCurrentUser({
        id: `mock-${role}`,
        email: `${role}@tinigkabataan.org`,
        full_name: role === 'public_user' ? 'Guest Citizen' : `Officer (${role})`,
        role: role,
        status: 'active',
        created_at: new Date().toISOString(),
      });
    }
  };

  const loginAsDemoUser = (email: string) => {
    const profile = initialProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
    if (profile) {
      setCurrentUser(profile);
    }
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      supabase?.auth.signOut();
    }
    // Switch to public user
    switchRole('public_user');
  };

  const isHQAuthorized = ['super_admin', 'admin', 'department_head', 'officer', 'content_reviewer'].includes(
    currentUser.role
  );

  const hasPermission = (action: string): boolean => {
    if (currentUser.role === 'super_admin') return true;

    switch (action) {
      case 'access_hq':
        return isHQAuthorized;
      case 'manage_system_settings':
      case 'manage_all_departments':
      case 'view_full_audit_logs':
        return ['super_admin', 'admin'].includes(currentUser.role);
      case 'manage_websites':
        return ['super_admin', 'admin'].includes(currentUser.role);
      case 'manage_department_projects':
        return ['super_admin', 'admin', 'department_head'].includes(currentUser.role);
      case 'manage_tasks':
        return ['super_admin', 'admin', 'department_head', 'officer'].includes(currentUser.role);
      case 'publish_content':
        return ['super_admin', 'admin', 'content_reviewer', 'department_head'].includes(currentUser.role);
      case 'upload_documents':
        return ['super_admin', 'admin', 'department_head', 'officer'].includes(currentUser.role);
      case 'view_restricted_documents':
        return ['super_admin', 'admin'].includes(currentUser.role);
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        isAuthenticated: currentUser.role !== 'public_user',
        isHQAuthorized,
        switchRole,
        setUser: setCurrentUser,
        loginAsDemoUser,
        logout,
        availableProfiles: initialProfiles,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
