'use client';

import React, { useState } from 'react';
import { useSandigan } from '@/lib/sandigan/sandigan-context';
import {
  MapPin,
  PhoneCall,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Send,
  Building,
  Clock,
  Mail,
  Filter,
} from 'lucide-react';

export default function SandiganFindSupportPage() {
  const { bataanServices, createReferral, session, isDarkMode } = useSandigan();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedFacilityForReferral, setSelectedFacilityForReferral] = useState<string | null>(null);
  const [concernSummary, setConcernSummary] = useState('');
  const [referralSentSuccess, setReferralSentSuccess] = useState(false);

  const filtered = bataanServices.filter(s => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase()) ||
      s.services.some(svc => svc.toLowerCase().includes(search.toLowerCase()));
    const matchesType = selectedType === 'all' || s.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleInitiateReferral = (facilityId: string, facilityName: string) => {
    setSelectedFacilityForReferral(facilityId);
    setConcernSummary('');
    setReferralSentSuccess(false);
  };

  const handleSubmitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacilityForReferral || !concernSummary.trim()) return;

    const fac = bataanServices.find(f => f.id === selectedFacilityForReferral);

    createReferral({
      facilityId: selectedFacilityForReferral,
      facilityName: fac?.name || 'Bataan Facility',
      userConcernSummary: concernSummary.trim(),
    });

    setReferralSentSuccess(true);
    setTimeout(() => {
      setSelectedFacilityForReferral(null);
      setReferralSentSuccess(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full bg-blue-500/10 inline-block">
          Curated by KAWING (Referrals & Partnerships Lead)
        </span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Find Verified Support in Bataan & Beyond
        </h1>
        <p
          className={`text-xs sm:text-sm max-w-xl mx-auto ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Connecting young people with certified psychiatric hospitals, community psychosocial desks, and emergency crisis intervention. Prioritizing verified care in Bataan Province.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`p-5 rounded-3xl border shadow-sm flex flex-col md:flex-row gap-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by hospital name, town (e.g. Balanga, Mariveles), or service..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none"
        >
          <option value="all">All Care Facility Types</option>
          <option value="Psychiatric Center">Psychiatric Centers</option>
          <option value="Government Hospital">Government Hospitals</option>
          <option value="City Health Office">City / Municipal Health Desks</option>
          <option value="Crisis Support">24/7 National Hotlines</option>
        </select>
      </div>

      {/* Verified Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-6 ${
              item.priorityRegion === 'Bataan'
                ? isDarkMode
                  ? 'bg-slate-900 border-blue-900/60'
                  : 'bg-white border-blue-200/80 shadow-md'
                : isDarkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    item.priorityRegion === 'Bataan'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.priorityRegion === 'Bataan' ? '⭐ Verified Bataan Facility' : 'Nationwide Service'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{item.type}</span>
              </div>

              <div>
                <h3 className="text-base font-bold leading-snug">{item.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{item.location}</span>
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px]">{item.operatingHours}</span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Services Offered:
                </span>
                {item.services.map((svc, i) => (
                  <div key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                    <span className="text-blue-500">•</span>
                    <span>{svc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <a
                href={`tel:${item.phone}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {item.phone}</span>
              </a>

              {item.priorityRegion === 'Bataan' && (
                <button
                  onClick={() => handleInitiateReferral(item.id, item.name)}
                  className="px-3 py-2.5 rounded-xl border border-blue-400/60 hover:bg-blue-50 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-300 text-xs font-bold transition flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Request Connection</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* REFERRAL MODAL (Section 7 Workflow) */}
      {selectedFacilityForReferral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div
            className={`rounded-3xl max-w-lg w-full p-6 sm:p-8 border shadow-2xl space-y-5 ${
              isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {referralSentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black">Referral Summary Logged!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  KAWING has generated your anonymous intake summary under identifier <strong>{session.anonymousId}</strong>. You can view or present this summary during consultation.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReferral} className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
                  <h3 className="text-base font-bold">Prepare Professional Care Summary</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedFacilityForReferral(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-slate-700 dark:text-slate-200 space-y-1">
                  <span className="font-bold text-blue-700 dark:text-blue-300 block">
                    Zero Fabricated Connections:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    Under Project Sandigan's clinical ethics, this workflow compiles your self-reported concern so you do not have to repeat traumatic history from scratch when arriving at the clinic.
                  </p>
                </div>

                <div>
                  <label className="block font-bold mb-1">
                    What primary struggles would you like the physician / counselor to know?
                  </label>
                  <textarea
                    rows={4}
                    value={concernSummary}
                    onChange={e => setConcernSummary(e.target.value)}
                    placeholder="e.g. Experiencing panic attacks before class, trouble sleeping for 3 weeks..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!concernSummary.trim()}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow transition"
                >
                  Confirm & Generate Referral Summary
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
