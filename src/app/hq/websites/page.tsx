'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { useAuth } from '@/lib/auth/auth-context';
import { Website } from '@/types';
import {
  Globe2,
  Plus,
  ExternalLink,
  Edit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Trash2,
  Layers,
} from 'lucide-react';

export default function WebsitesRegistryPage() {
  const { websites, departments, addWebsite, updateWebsite, toggleWebsiteStatus } = useEcosystem();
  const { hasPermission } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSite, setEditingSite] = useState<Website | null>(null);

  // New site form state
  const [siteTitle, setSiteTitle] = useState('');
  const [siteSlug, setSiteSlug] = useState('');
  const [siteTagline, setSiteTagline] = useState('');
  const [siteDesc, setSiteDesc] = useState('');
  const [siteDeptId, setSiteDeptId] = useState(departments[0]?.id || '');
  const [primaryColor, setPrimaryColor] = useState('#31556B');

  const canManageSites = hasPermission('manage_websites');

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteTitle.trim() || !siteSlug.trim()) return;

    const dept = departments.find(d => d.id === siteDeptId);

    addWebsite({
      title: siteTitle.trim(),
      slug: siteSlug.trim().toLowerCase(),
      tagline: siteTagline.trim(),
      description: siteDesc.trim(),
      department_id: siteDeptId,
      department_name: dept?.name,
      primary_color: primaryColor,
      status: 'published',
      url_path: `/${siteSlug.trim().toLowerCase()}`,
      nav_links: [
        { label: 'Portal Home', href: `/${siteSlug.trim().toLowerCase()}` },
        { label: 'About', href: '/about' },
      ],
    });

    setSiteTitle('');
    setSiteSlug('');
    setSiteTagline('');
    setSiteDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-teal">
            Multi-Portal Infrastructure
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Website Registry & Portals Manager
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure, publish, and monitor multiple service websites connected to the central TK administration system.
          </p>
        </div>

        {canManageSites && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Portal</span>
          </button>
        )}
      </div>

      {/* Website Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map(site => (
          <div
            key={site.id}
            className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-sm hover:border-slate-700 transition flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: site.primary_color }}
                  />
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                    /{site.slug}
                  </span>
                </div>

                <button
                  onClick={() => toggleWebsiteStatus(site.id)}
                  className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full transition ${
                    site.status === 'published'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                  title="Click to toggle publication status"
                >
                  {site.status}
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{site.title}</h3>
                <p className="text-xs text-sky-400 mt-0.5 font-medium">{site.tagline}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{site.description}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Owning Wing:</span>
                  <strong className="text-white truncate max-w-[150px]">
                    {site.department_name || 'Central Administration'}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Navigation Links:</span>
                  <span className="text-slate-300 font-mono">{site.nav_links.length} routes</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
              <Link
                href={site.url_path}
                target="_blank"
                className="text-sky-400 hover:text-sky-300 font-bold inline-flex items-center gap-1"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {canManageSites && (
                <button
                  onClick={() => toggleWebsiteStatus(site.id)}
                  className="text-slate-400 hover:text-white text-xs font-semibold"
                >
                  {site.status === 'published' ? 'Unpublish' : 'Publish Live'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Register New Portal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Register Autonomous Website Portal</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Portal Title</label>
                <input
                  type="text"
                  value={siteTitle}
                  onChange={e => setSiteTitle(e.target.value)}
                  placeholder="e.g. TK Climate Action Desk"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Route Slug</label>
                  <input
                    type="text"
                    value={siteSlug}
                    onChange={e => setSiteSlug(e.target.value)}
                    placeholder="e.g. climate"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Assigned Department</label>
                  <select
                    value={siteDeptId}
                    onChange={e => setSiteDeptId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={siteTagline}
                  onChange={e => setSiteTagline(e.target.value)}
                  placeholder="e.g. Grassroots Ecological Action"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={siteDesc}
                  onChange={e => setSiteDesc(e.target.value)}
                  placeholder="Mission, scope, and target youth audience..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition mt-2"
              >
                Register & Provision Route
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
