'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { UserProfile, UserRole } from '@/types';
import {
  Users2,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Edit2,
  Lock,
} from 'lucide-react';

export default function OfficersPage() {
  const { availableProfiles, hasPermission } = useAuth();
  const { departments, logAction } = useEcosystem();

  const [profiles, setProfiles] = useState<UserProfile[]>(availableProfiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionsMatrix, setShowPermissionsMatrix] = useState(false);

  // New Officer Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('officer');
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || '');
  const [title, setTitle] = useState('');

  const canManageOfficers = hasPermission('manage_system_settings');

  const filteredOfficers = profiles.filter(p => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const dept = departments.find(d => d.id === selectedDeptId);

    const newOfficer: UserProfile = {
      id: `usr-${Date.now()}`,
      full_name: fullName.trim(),
      email: email.trim(),
      role: selectedRole,
      department_id: selectedDeptId,
      department_name: dept?.name,
      title: title.trim() || 'Officer',
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setProfiles(prev => [newOfficer, ...prev]);
    logAction('ADD_OFFICER', 'profiles', `Onboarded ${newOfficer.full_name} as ${newOfficer.role}`, newOfficer.id);

    setFullName('');
    setEmail('');
    setTitle('');
    setShowAddModal(false);
  };

  const permissionsMatrix = [
    { capability: 'Full Virtual HQ Map Access', super: true, admin: true, head: true, officer: true, reviewer: true, public: false },
    { capability: 'Create & Manage Projects', super: true, admin: true, head: true, officer: false, reviewer: false, public: false },
    { capability: 'Assign Tasks & Workflows', super: true, admin: true, head: true, officer: true, reviewer: false, public: false },
    { capability: 'Upload to Knowledge Brain', super: true, admin: true, head: true, officer: true, reviewer: false, public: false },
    { capability: 'Access Restricted Executive Docs', super: true, admin: true, head: false, officer: false, reviewer: false, public: false },
    { capability: 'Approve Public Editorial Submissions', super: true, admin: true, head: true, officer: false, reviewer: true, public: false },
    { capability: 'Manage Websites Registry & CMS', super: true, admin: true, head: false, officer: false, reviewer: false, public: false },
    { capability: 'Audit Logs & Governance', super: true, admin: true, head: false, officer: false, reviewer: false, public: false },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-tk-lavender">
            Human Resources & Governance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Officer Directory & Role Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage officer profiles, departmental assignments, and role-based access privileges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPermissionsMatrix(!showPermissionsMatrix)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Permissions Matrix</span>
          </button>

          {canManageOfficers && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Officer</span>
            </button>
          )}
        </div>
      </div>

      {/* Permissions Matrix Drawer/Card */}
      {showPermissionsMatrix && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Role-Based Access Control (RBAC) Enforcement</span>
            </h3>
            <button
              onClick={() => setShowPermissionsMatrix(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Capability / Operation</th>
                  <th className="p-3 text-center">Super Admin</th>
                  <th className="p-3 text-center">Admin</th>
                  <th className="p-3 text-center">Dept Head</th>
                  <th className="p-3 text-center">Officer</th>
                  <th className="p-3 text-center">Reviewer</th>
                  <th className="p-3 text-center text-rose-400">Public</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {permissionsMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">{row.capability}</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{row.super ? '✓' : '—'}</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{row.admin ? '✓' : '—'}</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{row.head ? '✓' : '—'}</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{row.officer ? '✓' : '—'}</td>
                    <td className="p-3 text-center text-emerald-400 font-bold">{row.reviewer ? '✓' : '—'}</td>
                    <td className="p-3 text-center text-rose-400 font-bold">{row.public ? '✓' : '✕'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search officers by name, email, or position..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-tk-deepblue"
          />
        </div>

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="text-xs bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Platform Admin</option>
          <option value="department_head">Department Head</option>
          <option value="officer">Officer</option>
          <option value="content_reviewer">Content Reviewer</option>
        </select>
      </div>

      {/* Officers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfficers.map(officer => (
          <div
            key={officer.id}
            className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-sm hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-tk-deepblue to-tk-teal flex items-center justify-center text-white font-bold text-base shadow">
                  {officer.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{officer.full_name}</h3>
                  <p className="text-xs text-sky-400 font-medium">{officer.title || 'Officer'}</p>
                </div>
              </div>

              <span
                className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                  officer.role === 'super_admin'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : officer.role === 'department_head'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {officer.role.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {officer.bio || 'Active team member contributing to youth advocacy and initiatives.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{officer.department_name || 'Central Administration'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{officer.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Onboard Officer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Onboard New Officer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleAddOfficer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Maria Teresa Santos"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. teresa@tinigkabataan.org"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Role</label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value as UserRole)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="officer">Officer</option>
                    <option value="department_head">Department Head</option>
                    <option value="content_reviewer">Content Reviewer</option>
                    <option value="admin">Platform Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Department</label>
                  <select
                    value={selectedDeptId}
                    onChange={e => setSelectedDeptId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Position Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Regional Mobilization Lead"
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-tk-deepblue hover:bg-tk-darkblue text-white font-bold text-xs shadow transition mt-2"
              >
                Complete Onboarding
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
