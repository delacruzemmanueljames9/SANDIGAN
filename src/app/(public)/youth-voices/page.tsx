'use client';

import React, { useState } from 'react';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { Heart, Send, CheckCircle2, ShieldAlert, Sparkles, Filter } from 'lucide-react';

export default function YouthVoicesPage() {
  const { youthVoices, addYouthVoiceSubmission, likeYouthVoice } = useEcosystem();

  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [ageGroup, setAgeGroup] = useState('19-21');
  const [region, setRegion] = useState('NCR');
  const [topic, setTopic] = useState('Academic Pressure');
  const [content, setContent] = useState('');
  const [consentRules, setConsentRules] = useState(false);

  const publishedVoices = youthVoices.filter(v => v.status === 'published');
  const filteredVoices = publishedVoices.filter(v => {
    if (filterRegion === 'All') return true;
    return v.region === filterRegion;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !consentRules) return;

    addYouthVoiceSubmission({
      author_display_name: isAnonymous || !authorName.trim() ? 'Anonymous Youth' : authorName.trim(),
      age_group: ageGroup,
      region,
      topic,
      content,
    });

    setContent('');
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
    }, 2200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-emerald bg-tk-softgreen/60 px-3 py-1 rounded-full">
            Safe Community Expression
          </span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-2">
            The Youth Voice Wall
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-xl">
            A safe, moderated space where Filipino young people share vulnerable reflections, triumphs over mental distress, and messages of hope.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-tk-emerald to-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition"
        >
          <Send className="w-4 h-4" />
          <span>Submit Your Reflection</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5" /> Region:
        </span>
        {['All', 'NCR', 'Luzon', 'Visayas', 'Mindanao', 'Nationwide'].map(reg => (
          <button
            key={reg}
            onClick={() => setFilterRegion(reg)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filterRegion === reg
                ? 'bg-tk-deepblue text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {reg}
          </button>
        ))}
      </div>

      {/* Grid of Youth Voice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map(voice => (
          <div
            key={voice.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tk-softgreen text-emerald-900">
                  {voice.topic}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {voice.region} • {voice.age_group}
                </span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed italic">
                "{voice.content}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                — {voice.author_display_name}
              </span>
              <button
                onClick={() => likeYouthVoice(voice.id)}
                className="flex items-center gap-1 text-xs text-rose-500 font-bold hover:scale-110 transition active:scale-95"
                title="Send heart / appreciation"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{voice.likes_count}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* SUBMISSION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            {submittedSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Reflection Received!</h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you for your bravery. Your voice has been forwarded to the TK Youth Editorial Board for child-safety review before appearing on the wall.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-xl font-black text-slate-900">Share Your Youth Voice</h3>
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                  >
                    Cancel
                  </button>
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700">Submit Anonymously</span>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Display Name or Pen Name
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                      placeholder="e.g. Maria Clara"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Age Group</label>
                    <select
                      value={ageGroup}
                      onChange={e => setAgeGroup(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="15-18">15-18 (High School)</option>
                      <option value="19-21">19-21 (College/Vocational)</option>
                      <option value="22-25">22-25 (Young Adult)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
                    <select
                      value={region}
                      onChange={e => setRegion(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="NCR">NCR (Metro Manila)</option>
                      <option value="Luzon">Luzon</option>
                      <option value="Visayas">Visayas</option>
                      <option value="Mindanao">Mindanao</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g. Academic Burnout, Self-Acceptance, Hope"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Reflection / Message
                  </label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Write honestly from the heart..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consentRules}
                    onChange={e => setConsentRules(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded"
                    required
                  />
                  <label htmlFor="consent" className="text-[11px] text-slate-600">
                    I consent to having my reflection published anonymously to support fellow youth, adhering to TK's anti-harassment guidelines.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!consentRules || !content.trim()}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow transition"
                >
                  Send for Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
