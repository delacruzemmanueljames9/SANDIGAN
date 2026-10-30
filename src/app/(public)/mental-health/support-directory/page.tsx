'use client';

import React, { useState } from 'react';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import {
  Search,
  PhoneCall,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export default function SupportDirectoryPage() {
  const { resources } = useEcosystem();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredResources = resources.filter(res => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.services_offered.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || res.region === selectedRegion || res.region === 'Nationwide';
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-tk-emerald bg-tk-softgreen/60 px-3 py-1 rounded-full">
          Verified Philippine Helplines & Centers
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Find Professional & Community Mental Health Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          A verified registry of free, subsidized, and emergency crisis intervention facilities across the Philippines.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by facility name, service, or keyword (e.g. NCMH, teleconsult, depression)..."
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-emerald"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="text-xs p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-emerald bg-white"
            >
              <option value="All">All Regions</option>
              <option value="Nationwide">Nationwide</option>
              <option value="NCR">NCR (Metro Manila)</option>
              <option value="Luzon">Luzon</option>
              <option value="Visayas">Visayas</option>
              <option value="Mindanao">Mindanao</option>
            </select>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs p-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-tk-emerald bg-white"
            >
              <option value="All">All Categories</option>
              <option value="Hotline">Hotlines</option>
              <option value="Crisis Center">Crisis Centers</option>
              <option value="Free Counseling">Free Counseling</option>
              <option value="Community Center">Community Centers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(res => (
          <div
            key={res.id}
            className={`p-6 rounded-3xl bg-white border shadow-sm hover:shadow-lg transition flex flex-col justify-between space-y-6 ${
              res.is_emergency ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200/80'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {res.category}
                </span>
                {res.is_emergency && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    24/7 Emergency
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{res.name}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {res.services_offered}
                </p>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Region: <strong className="text-slate-800">{res.region}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Hours: <strong className="text-slate-800">{res.operating_hours}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Action Dial Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              {res.phone && (
                <a
                  href={`tel:${res.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {res.phone}</span>
                </a>
              )}

              {res.mobile && (
                <a
                  href={`tel:${res.mobile.split(' / ')[0]}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mobile Line</span>
                </a>
              )}

              {res.website_url && (
                <a
                  href={res.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  title="Visit official website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
