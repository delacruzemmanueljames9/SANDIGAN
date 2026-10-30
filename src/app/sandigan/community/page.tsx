'use client';

import React, { useState } from 'react';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import { Users2, Heart, Send, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SandiganCommunityPage() {
  const { isDarkMode, session } = useSandigan();

  const [posts, setPosts] = useState([
    {
      id: 'post-1',
      author: 'Anonymous Student (Bataan)',
      topic: 'Overcoming Thesis Anxiety',
      content: 'During our defense preparation, my panic attacks were getting out of hand. Finding the Reset Room 4-7-8 breathing and writing in the Inner Garden helped me sleep again. Remember that grades do not measure your soul.',
      likes: 38,
      date: '2 days ago',
    },
    {
      id: 'post-2',
      author: 'Luzon Dreamer',
      topic: 'Breaking Family Silence',
      content: 'In our house, talking about depression was always taboo. But reaching out to a peer counselor gave me the courage to say "I need to rest." You are not a burden for having human emotions.',
      likes: 47,
      date: '3 days ago',
    },
  ]);

  const [newTopic, setNewTopic] = useState('');
  const [newContent, setNewContent] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setSentSuccess(true);
    setNewTopic('');
    setNewContent('');
    setTimeout(() => setSentSuccess(false), 2500);
  };

  const likePost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-500 px-3 py-1 rounded-full bg-rose-500/10 inline-block">
          Moderated by TALA (Community Support Lead)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Safe Community & Voice of Youth
        </h1>
        <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          A moderated peer sanctuary where Filipino youth share vulnerable reflections of hope and healing without fear of judgment.
        </p>
      </div>

      {/* Guidelines Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-rose-50/70 border-rose-200 text-slate-700'
        }`}
      >
        <ShieldCheck className="w-5 h-5 text-rose-500 shrink-0" />
        <span>
          Strict anti-cyberbullying & child safety standards enforced. Every post undergoes automated and officer review prior to publication.
        </span>
      </div>

      {/* Share Reflection Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-4 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <h2 className="text-base font-bold flex items-center gap-2">
          <Send className="w-4 h-4 text-rose-500" />
          <span>Share a Message of Hope</span>
        </h2>

        {sentSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold">Reflection Submitted!</h3>
            <p className="text-xs text-slate-500">
              TALA is reviewing your reflection to ensure safe community standards before it appears on the public board.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Theme / Topic</label>
              <input
                type="text"
                value={newTopic}
                onChange={e => setNewTopic(e.target.value)}
                placeholder="e.g. Dealing with School Stress, Finding Peace..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Your Message (Anonymous)</label>
              <textarea
                rows={3}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Write words of encouragement or a personal milestone..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow transition"
            >
              Submit for TALA Review
            </button>
          </form>
        )}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map(post => (
          <div
            key={post.id}
            className={`p-6 rounded-3xl border space-y-3 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[10px] uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600">
                {post.topic}
              </span>
              <span className="text-slate-400">{post.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
              "{post.content}"
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">— {post.author}</span>
              <button
                onClick={() => likePost(post.id)}
                className="flex items-center gap-1.5 text-rose-500 font-bold hover:scale-105 transition"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>{post.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
