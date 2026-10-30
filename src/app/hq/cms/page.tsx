'use client';

import React, { useState } from 'react';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { useAuth } from '@/lib/auth/auth-context';
import {
  FileEdit,
  CheckCircle2,
  XCircle,
  Plus,
  Clock,
  Sparkles,
  Search,
  Filter,
  Eye,
  Send,
  Bell,
} from 'lucide-react';

export default function CMSPage() {
  const { announcements, youthVoices, addAnnouncement, approveYouthVoice, logAction } = useEcosystem();
  const { currentUser, hasPermission } = useAuth();

  const [activeSection, setActiveSection] = useState<'announcements' | 'voice_queue'>('voice_queue');
  const [showNewDispatchModal, setShowNewDispatchModal] = useState(false);

  // New announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annPriority, setAnnPriority] = useState<'normal' | 'urgent' | 'info'>('normal');
  const [annAudience, setAnnAudience] = useState<'all_hq' | 'public' | 'department'>('all_hq');
  const [isPinned, setIsPinned] = useState(false);

  const canPublish = hasPermission('publish_content');

  const pendingVoices = youthVoices.filter(v => v.status === 'pending_review');
  const publishedVoices = youthVoices.filter(v => v.status === 'published');

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      priority: annPriority,
      target_audience: annAudience,
      is_pinned: isPinned,
    });

    setAnnTitle('');
    setAnnContent('');
    setShowNewDispatchModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-violet">
            Editorial Pipeline & Moderation
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Central Content Management System (CMS)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review youth reflections for child-safety compliance, publish official dispatches, and manage public updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Section Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSection('voice_queue')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
                activeSection === 'voice_queue'
                  ? 'bg-tk-deepblue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Moderation Queue</span>
              {pendingVoices.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {pendingVoices.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSection('announcements')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 ${
                activeSection === 'announcements'
                  ? 'bg-tk-deepblue text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Dispatches & News</span>
            </button>
          </div>

          {canPublish && (
            <button
              onClick={() => setShowNewDispatchModal(true)}
              className="px-4 py-2 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Dispatch</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: YOUTH VOICE MODERATION QUEUE */}
      {activeSection === 'voice_queue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Pending Review Submissions ({pendingVoices.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Submissions from the public Youth Voice Wall awaiting ethical review before publication.
              </p>
            </div>
          </div>

          {pendingVoices.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">All Clear!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are no pending submissions in the moderation queue at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingVoices.map(item => (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-slate-950 border border-amber-900/40 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                        Pending Moderation
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.region} • Age {item.age_group}
                      </span>
                    </div>

                    <div className="text-xs text-sky-400 font-bold">Topic: {item.topic}</div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-xs leading-relaxed italic">
                      "{item.content}"
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Author: <strong className="text-slate-300">{item.author_display_name}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-end gap-2">
                    <button
                      onClick={() => approveYouthVoice(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish Live</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Published Voices Summary */}
          <div className="pt-8 border-t border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">
              Recently Published Submissions ({publishedVoices.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {publishedVoices.slice(0, 3).map(voice => (
                <div
                  key={voice.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-emerald-400">Live on Wall</span>
                    <span>{voice.region}</span>
                  </div>
                  <p className="text-slate-300 italic line-clamp-2">"{voice.content}"</p>
                  <span className="text-slate-500 text-[10px] block">— {voice.author_display_name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ANNOUNCEMENTS & DISPATCHES */}
      {activeSection === 'announcements' && (
        <div className="space-y-4">
          {announcements.map(ann => (
            <div
              key={ann.id}
              className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-sky-400">
                    {ann.target_audience.replace('_', ' ')}
                  </span>
                  {ann.is_pinned && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-300">
                      Pinned
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(ann.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">{ann.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                Dispatched by: <strong className="text-slate-300">{ann.created_by_name}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Dispatch Modal */}
      {showNewDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Broadcast Organizational Dispatch</h3>
              <button
                onClick={() => setShowNewDispatchModal(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="e.g. Schedule for General Assembly & Officer Summit"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={annAudience}
                    onChange={e => setAnnAudience(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="all_hq">All HQ Officers</option>
                    <option value="public">Public Website</option>
                    <option value="department">Assigned Wing Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Priority</label>
                  <select
                    value={annPriority}
                    onChange={e => setAnnPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="info">Information</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Dispatch Content</label>
                <textarea
                  rows={4}
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  placeholder="Detailed announcement and action steps..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500"
                />
                <label htmlFor="pin" className="text-slate-300">Pin to top of news & dispatches</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition mt-2"
              >
                Transmit Dispatch
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
