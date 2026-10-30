'use client';

import React, { useState } from 'react';
import { useEcosystem } from '@/lib/store/ecosystem-context';
import { useAuth } from '@/lib/auth/auth-context';
import { ShieldCheck, Search, Filter, Calendar, Lock } from 'lucide-react';

export default function AuditLogsPage() {
  const { auditLogs } = useEcosystem();
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState('');

  const canViewAuditLogs = hasPermission('view_full_audit_logs');

  if (!canViewAuditLogs) {
    return (
      <div className="p-12 text-center rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
        <Lock className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Administrative Clearance Required</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Audit trails and immutable security event logs are restricted to Super Admin and Platform Administrator roles.
        </p>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.user_name.toLowerCase().includes(search.toLowerCase()) ||
    log.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Security Governance & Accountability</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          System Audit Logs & Event Trail
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Immutable event log of all administrative actions, document uploads, moderation decisions, and system setting updates across the Tinig KaBataan digital ecosystem.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter audit logs by action, officer, or details..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Officer / User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/40">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-white whitespace-nowrap font-sans">
                    {log.user_name}
                  </td>
                  <td className="p-4 text-sky-400 uppercase text-[10px]">
                    {log.user_role}
                  </td>
                  <td className="p-4 text-emerald-400 font-bold whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="p-4 text-slate-400">
                    {log.entity_type}
                  </td>
                  <td className="p-4 text-slate-200 font-sans text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
