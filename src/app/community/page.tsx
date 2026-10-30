"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  Heart,
  ShieldCheck,
  AlertTriangle,
  Lock,
  MessageSquare,
  Plus,
  Send,
  Loader2,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommunityPost {
  id: string;
  author_alias: string;
  title: string;
  content: string;
  category: "general" | "gratitude" | "struggles" | "hope" | "advice";
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  moderation_status: string;
}

const CATEGORIES = [
  { id: "all", label: "All Topics" },
  { id: "gratitude", label: "Gratitude & Joy" },
  { id: "hope", label: "Hope & Healing" },
  { id: "struggles", label: "Struggles & Venting" },
  { id: "advice", label: "Advice & Questions" },
  { id: "general", label: "General Discussion" },
] as const;

export default function CommunityPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = React.useState<"feed" | "guidelines">("feed");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [posts, setPosts] = React.useState<CommunityPost[]>([]);
  const [loadingPosts, setLoadingPosts] = React.useState(true);

  // New post modal / form state
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [postTitle, setPostTitle] = React.useState("");
  const [postContent, setPostContent] = React.useState("");
  const [postCategory, setPostCategory] = React.useState<string>("gratitude");
  const [postAnonymous, setPostAnonymous] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [crisisAlert, setCrisisAlert] = React.useState(false);

  // Fetch posts
  const fetchPosts = React.useCallback(async () => {
    setLoadingPosts(true);
    try {
      const url =
        selectedCategory === "all"
          ? "/api/community"
          : `/api/community?category=${selectedCategory}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.posts) {
        setPosts(json.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  }, [selectedCategory]);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!postTitle.trim() || !postContent.trim()) {
      setSubmitError("Please provide both a title and content.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setCrisisAlert(false);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postTitle.trim(),
          content: postContent.trim(),
          category: postCategory,
          is_anonymous: postAnonymous,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to create post.");
      }

      if (json.isCrisis) {
        setCrisisAlert(true);
      }

      setPostTitle("");
      setPostContent("");
      setShowCreateModal(false);
      fetchPosts();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to create post.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "gratitude":
        return <Badge variant="gold">Gratitude</Badge>;
      case "hope":
        return <Badge variant="emerald">Hope</Badge>;
      case "struggles":
        return <Badge variant="outline">Struggles</Badge>;
      case "advice":
        return <Badge variant="teal">Advice</Badge>;
      default:
        return <Badge variant="navy">General</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="teal">Peer Support &amp; Moderation</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-sandigan-navy dark:text-white tracking-tight">
          Safe Peer Community
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          A moderated, empathetic space to share your story, find hope, and connect with peers
          across the Philippines.
        </p>

        {/* Tab switch */}
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "feed"
                ? "bg-sandigan-navy text-white shadow-sm dark:bg-sandigan-navy-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Community Posts
          </button>
          <button
            onClick={() => setActiveTab("guidelines")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "guidelines"
                ? "bg-sandigan-navy text-white shadow-sm dark:bg-sandigan-navy-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Rules &amp; Guidelines
          </button>
        </div>
      </div>

      {/* Crisis Warning Banner */}
      {crisisAlert && (
        <div className="rounded-xl bg-rose-600 text-white p-4 shadow-md flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-sm">
              Your post has been received and held for supportive review.
            </p>
            <p className="text-xs text-rose-100 mt-1">
              If you are in distress right now, please reach out to our 24/7 national partners:
            </p>
            <p className="text-xs font-semibold mt-2">
              NCMH Hopeline: 1553 · In Touch: 02-8893-7603 · Hopeline PH: 2919
            </p>
          </div>
          <button onClick={() => setCrisisAlert(false)} className="text-white hover:opacity-80">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* FEED TAB */}
      {activeTab === "feed" && (
        <div className="space-y-6">
          {/* Top Bar: Categories & Create Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? "bg-sandigan-teal text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Create Post Button */}
            {user ? (
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="teal"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                className="shrink-0"
              >
                Share a Reflection
              </Button>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center font-medium transition-colors rounded-xl bg-sandigan-teal text-white hover:bg-sandigan-teal-600 shadow-sm h-9 px-3 text-xs gap-1.5 shrink-0"
              >
                Sign In to Post
              </Link>
            )}
          </div>

          {/* Create Post Form */}
          {showCreateModal && (
            <Card className="border-sandigan-teal/40 shadow-md">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Share with the Community</CardTitle>
                  <CardDescription className="text-xs">
                    Every post is actively moderated to keep this space safe for everyone.
                  </CardDescription>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Title
                    </label>
                    <Input
                      placeholder="A short summary of what you're sharing..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                        Category
                      </label>
                      <select
                        value={postCategory}
                        onChange={(e) => setPostCategory(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-100"
                      >
                        <option value="gratitude">Gratitude & Joy</option>
                        <option value="hope">Hope & Healing</option>
                        <option value="struggles">Struggles & Venting</option>
                        <option value="advice">Advice & Questions</option>
                        <option value="general">General Discussion</option>
                      </select>
                    </div>

                    <div className="flex items-center pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={postAnonymous}
                          onChange={(e) => setPostAnonymous(e.target.checked)}
                          className="rounded border-slate-300 text-sandigan-teal focus:ring-sandigan-teal"
                        />
                        <span>Post Anonymously (Display as &ldquo;Anonymous Peer&rdquo;)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 block">
                      Your Story or Reflection
                    </label>
                    <Textarea
                      placeholder="Write freely. Please do not include phone numbers, addresses, or explicit self-harm descriptions..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="text-sm min-h-[120px]"
                      required
                    />
                  </div>

                  {submitError && (
                    <p className="text-xs text-rose-600 dark:text-rose-400">{submitError}</p>
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      variant="teal"
                      size="sm"
                      leftIcon={
                        submitting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )
                      }
                    >
                      {submitting ? "Posting…" : "Publish Post"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Posts List */}
          {loadingPosts ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-sandigan-teal" />
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-slate-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No posts in this category yet. Be the first to share.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {getCategoryBadge(post.category)}
                          <span className="text-xs text-slate-400">
                            by {post.author_alias} ·{" "}
                            {new Date(post.created_at).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <CardTitle className="text-base text-slate-900 dark:text-white">
                          {post.title}
                        </CardTitle>
                      </div>
                      {post.moderation_status === "pending" && (
                        <Badge variant="outline" className="text-xs">
                          In Review
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GUIDELINES TAB */}
      {activeTab === "guidelines" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                1. Radical Empathy &amp; Respect
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Treat every peer with patience, kindness, and dignity. Hate speech, discrimination,
                victim-blaming, and harassment have zero tolerance.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                2. Zero-Tolerance for Bullying &amp; Shaming
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Mocking another person&apos;s emotional distress, background, or identity results in
                immediate removal and moderation review.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                3. Responsible Sharing &amp; Content Boundaries
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Avoid graphic descriptions of self-harm methods, eating disorder behaviors, or
                explicit trauma details that could trigger vulnerable peers.
              </p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sandigan-teal-50 text-sandigan-teal dark:bg-sandigan-teal-950/60 dark:text-sandigan-teal-300 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-base text-sandigan-navy dark:text-white">
                4. Anonymity &amp; Privacy Protection
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Never reveal private personal information (full names, home addresses, phone numbers,
                or social media handles) of yourself or others.
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
