'use client';

import React, { useState } from 'react';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { useAuth } from '@/lib/auth/auth-context';
import { DocumentItem, AccessLevel } from '@/types';
import {
  Library,
  Search,
  Upload,
  Lock,
  Download,
  FileText,
  FileCheck,
  Shield,
  Tag,
  CheckCircle2,
  Calendar,
  Eye,
  Filter,
} from 'lucide-react';

export default function KnowledgeBrainPage() {
  const { documents, departments, addDocument, recordDocumentDownload } = useEcosystem();
  const { currentUser, hasPermission } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Upload modal form
  const [docTitle, setDocTitle] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docCategory, setDocCategory] = useState('Governance & Policies');
  const [docDeptId, setDocDeptId] = useState(departments[0]?.id || '');
  const [docAccessLevel, setDocAccessLevel] = useState<AccessLevel>('internal');
  const [docTags, setDocTags] = useState('SOP, Youth, 2026');
  const [docVersion, setDocVersion] = useState('v1.0');

  const canViewRestricted = hasPermission('view_restricted_documents');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || doc.category_name.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesAccess =
      selectedAccessLevel === 'all' || doc.access_level === selectedAccessLevel;

    return matchesSearch && matchesCategory && matchesAccess;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const dept = departments.find(d => d.id === docDeptId);

    addDocument({
      title: docTitle.trim(),
      description: docDesc.trim(),
      category_name: docCategory,
      department_id: docDeptId,
      department_name: dept?.name,
      access_level: docAccessLevel,
      version: docVersion || 'v1.0',
      tags: docTags.split(',').map(t => t.trim()).filter(Boolean),
      file_size_kb: Math.floor(400 + Math.random() * 2000),
      file_type: 'pdf',
    });

    setDocTitle('');
    setDocDesc('');
    setShowUploadModal(false);
  };

  const handleDownload = (doc: DocumentItem) => {
    recordDocumentDownload(doc.id);
    // Create quick downloadable text manifest representing document
    const content = `TINIG KABATAAN (TK) KNOWLEDGE ARCHIVE\n========================================\nDocument: ${doc.title}\nVersion: ${doc.version}\nCategory: ${doc.category_name}\nAuthor: ${doc.author_name}\nAccess Level: ${doc.access_level.toUpperCase()}\nDate: ${doc.created_at}\n\nDescription:\n${doc.description}\n\nTags: ${doc.tags.join(', ')}\n\n(Official verified digital record of Tinig KaBataan)`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title.replace(/\s+/g, '-').toLowerCase()}-${doc.version}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-teal">
            Institutional Memory & Repository
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Central TK Knowledge Brain
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified organizational SOPs, research papers, clinical protocols, and governance charters.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, keyword, or tag..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-tk-teal"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Governance">Governance & Policies</option>
            <option value="Clinical">Clinical Protocols & SOPs</option>
            <option value="Editorial">Editorial Guidelines</option>
            <option value="Executive">Executive & Financial</option>
          </select>

          <select
            value={selectedAccessLevel}
            onChange={e => setSelectedAccessLevel(e.target.value)}
            className="text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none"
          >
            <option value="all">All Access Levels</option>
            <option value="public">Public</option>
            <option value="internal">Internal Officers</option>
            <option value="restricted_admin">Restricted Admin</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map(doc => {
          const isRestricted = doc.access_level === 'restricted_admin';
          const canAccess = !isRestricted || canViewRestricted;

          return (
            <div
              key={doc.id}
              className={`p-6 rounded-3xl bg-slate-950 border transition flex flex-col justify-between space-y-4 ${
                !canAccess
                  ? 'border-rose-900/40 opacity-75'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      doc.access_level === 'restricted_admin'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : doc.access_level === 'internal'
                        ? 'bg-sky-950 text-sky-300 border border-sky-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {doc.access_level.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{doc.version}</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{doc.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{doc.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {doc.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  {doc.file_size_kb} KB • {doc.downloads_count} downloads
                </span>

                {canAccess ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
                      title="Inspect metadata"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Clearance Required</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Inspector / Preview Drawer */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono text-sky-400 font-bold uppercase text-[10px]">
                {previewDoc.version} Archive Record
              </span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <h3 className="text-lg font-bold text-white">{previewDoc.title}</h3>
            <p className="text-slate-300 leading-relaxed">{previewDoc.description}</p>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="font-semibold text-white">{previewDoc.category_name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Originating Wing:</span>
                <span className="font-semibold text-white">{previewDoc.department_name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Author / Sign-off:</span>
                <span className="font-semibold text-white">{previewDoc.author_name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Access Classification:</span>
                <span className="font-mono font-bold text-sky-400 uppercase">{previewDoc.access_level}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Upload to Knowledge Brain</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  placeholder="e.g. SOP-MHD-05: Peer Facilitation Standards"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={docCategory}
                    onChange={e => setDocCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="Governance & Policies">Governance & Policies</option>
                    <option value="Mental Health Clinical Protocols">Clinical Protocols</option>
                    <option value="Editorial Guidelines">Editorial Guidelines</option>
                    <option value="Executive & Financial Archives">Executive Archives</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Access Level</label>
                  <select
                    value={docAccessLevel}
                    onChange={e => setDocAccessLevel(e.target.value as AccessLevel)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="internal">Internal Officers</option>
                    <option value="public">Public</option>
                    <option value="restricted_admin">Restricted Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={docTags}
                  onChange={e => setDocTags(e.target.value)}
                  placeholder="e.g. SOP, Mental Health, 2026"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Summary / Abstract</label>
                <textarea
                  rows={3}
                  value={docDesc}
                  onChange={e => setDocDesc(e.target.value)}
                  placeholder="Detailed context and purpose of this document..."
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition mt-2"
              >
                Archive in Knowledge Brain
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
