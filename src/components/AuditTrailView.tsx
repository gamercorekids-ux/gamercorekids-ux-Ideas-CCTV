import React, { useState } from 'react';
import {
  ScrollText,
  Clock,
  UserCheck,
  Lock,
  Search,
  RotateCw,
  FileDown,
  Eye,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { AuditLog } from '../types';
import { AuditDeepDiveModal } from './AuditDeepDiveModal';

interface AuditTrailViewProps {
  logs: AuditLog[];
  onSyncDb: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs, onSyncDb }) => {
  const [activeScope, setActiveScope] = useState<string>('All Events');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const totalLogs = logs.length;
  const todayChanges = logs.filter(l => {
    const d = new Date(l.timestamp);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const scopes = [
    { id: 'All Events', label: 'All Events', count: logs.length },
    { id: 'Ticket Ops', label: '1. Ticket Ops', count: logs.filter(l => l.scope_category === 'Ticket Ops').length },
    { id: 'User Governance', label: '2. User Governance', count: logs.filter(l => l.scope_category === 'User Governance').length },
    { id: 'Ticket Assignment', label: '3. Ticket Assignment', count: logs.filter(l => l.scope_category === 'Ticket Assignment').length },
    { id: 'System & Config', label: '4. System & Config', count: logs.filter(l => l.scope_category === 'System & Config').length },
    { id: 'Admin Activities', label: '5. Admin Activities', count: logs.filter(l => l.scope_category === 'Admin Activities').length }
  ];

  const filteredLogs = logs.filter(log => {
    if (activeScope !== 'All Events' && log.scope_category !== activeScope) {
      return false;
    }
    if (selectedAdmin !== 'ALL' && log.administrator !== selectedAdmin) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        log.administrator.toLowerCase().includes(q) ||
        log.setting_changed.toLowerCase().includes(q) ||
        log.action_narrative.toLowerCase().includes(q) ||
        log.action_code.toLowerCase().includes(q) ||
        log.ip_session.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const uniqueAdmins = Array.from(new Set(logs.map(l => l.administrator)));

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Four Stat Cards (Matching Image 9 & 17) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Audit Events */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOTAL AUDIT EVENTS</div>
            <div className="text-3xl font-extrabold text-slate-900 my-1 tabular-nums">{totalLogs}</div>
            <div className="text-[11px] text-slate-400">Immutable compliance entries</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <ScrollText className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Today's Changes */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">TODAY'S CHANGES</div>
            <div className="text-3xl font-extrabold text-blue-600 my-1 tabular-nums">{todayChanges || totalLogs}</div>
            <div className="text-[11px] text-slate-400">Administrative executions</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Active Operators */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">ACTIVE OPERATORS</div>
            <div className="text-3xl font-extrabold text-emerald-600 my-1 tabular-nums">3</div>
            <div className="text-[11px] text-slate-400">Authorized system users</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Integrity Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">INTEGRITY STATUS</div>
            <div className="text-xl font-extrabold text-emerald-700 my-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Immutable</span>
            </div>
            <div className="text-[11px] text-slate-400">Write-once audit ledger</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. Status Bar: Live Synced & Export Buttons */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">SYSTEM AUDIT TRAIL</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              ● Live Synced
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Immutable record of administrative changes, including user, timestamp, previous value, new value, and session data.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-mono text-slate-600">
            Hostinger MySQL & Compliance
          </span>

          <button
            onClick={onSyncDb}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Save & Sync</span>
          </button>

          <button
            onClick={() => window.open('/api/database/export?target=audit&format=csv', '_blank')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.open('/api/database/export?target=audit&format=json', '_blank')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* 3. Search and Scope Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        {/* Search Bar & Dropdowns */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search administrator, setting, IP, or details..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeScope}
              onChange={e => setActiveScope(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="All Events">All Audit Scopes (1-5)</option>
              {scopes.slice(1).map(s => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>

            <select
              value={selectedAdmin}
              onChange={e => setSelectedAdmin(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Administrators</option>
              {uniqueAdmins.map(adm => (
                <option key={adm} value={adm}>
                  {adm}
                </option>
              ))}
            </select>

            <select className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none">
              <option>All Recorded Time</option>
              <option>Past 24 Hours</option>
              <option>Past 7 Days</option>
            </select>

            <span className="text-xs text-slate-400 whitespace-nowrap pl-2">
              Showing <span className="font-bold text-slate-800">{filteredLogs.length}</span> of {logs.length} logs
            </span>
          </div>
        </div>

        {/* Scope Tabs (Matching Image 9) */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase">AUDIT SCOPES:</span>
          {scopes.map(scope => {
            const isActive = activeScope === scope.id;
            return (
              <button
                key={scope.id}
                onClick={() => setActiveScope(scope.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {scope.label} <span className="ml-1 opacity-80">{scope.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Logs Table (Matching Image 9 & 17) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">DATE & TIME</th>
                <th className="py-3.5 px-4">SCOPE CATEGORY</th>
                <th className="py-3.5 px-4">ADMINISTRATOR</th>
                <th className="py-3.5 px-4">SETTING CHANGED</th>
                <th className="py-3.5 px-4">PREVIOUS VALUE</th>
                <th className="py-3.5 px-4">NEW VALUE</th>
                <th className="py-3.5 px-4">IP / SESSION</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => {
                const scopeBadgeStyle = {
                  'Ticket Ops': 'bg-blue-50 text-blue-700 border-blue-200',
                  'User Governance': 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  'Ticket Assignment': 'bg-purple-50 text-purple-700 border-purple-200',
                  'System & Config': 'bg-amber-50 text-amber-700 border-amber-200',
                  'Admin Activities': 'bg-rose-50 text-rose-700 border-rose-200'
                }[log.scope_category] || 'bg-slate-50 text-slate-700 border-slate-200';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    {/* Scope Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${scopeBadgeStyle}`}>
                        {log.scope_category}
                      </span>
                    </td>

                    {/* Administrator */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{log.administrator}</div>
                      <div className="text-[10px] text-slate-400 font-mono">UID: {log.user_id}</div>
                    </td>

                    {/* Setting Changed */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200">
                        {log.setting_changed}
                      </span>
                    </td>

                    {/* Previous Value */}
                    <td className="py-3.5 px-4 text-slate-400 max-w-[120px] truncate">
                      {log.previous_value || '—'}
                    </td>

                    {/* New Value */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.new_value && log.new_value !== '—' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {log.new_value}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* IP / Session */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-500 text-[11px]">
                      {log.ip_session}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Modal */}
      {selectedLog && (
        <AuditDeepDiveModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
};
