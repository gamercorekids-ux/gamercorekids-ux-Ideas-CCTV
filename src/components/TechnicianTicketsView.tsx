import React, { useState } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  FileDown,
  Plus,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Store,
  UserPlus
} from 'lucide-react';
import { Ticket, User, Location, Region } from '../types';

interface TechnicianTicketsViewProps {
  tickets: Ticket[];
  users: User[];
  locations: Location[];
  regions: Region[];
  currentUser: User;
  onOpenNewTicket: () => void;
  onSelectTicket: (ticket: Ticket) => void;
  onUpdateTicketStatus: (ticketId: string, status: any) => void;
  onUpdateTicketPriority: (ticketId: string, priority: any) => void;
  onAssignTechnician: (ticketId: string, technicianId: string, technicianName: string) => void;
  onDeleteTicket: (ticketId: string) => void;
}

export const TechnicianTicketsView: React.FC<TechnicianTicketsViewProps> = ({
  tickets,
  users,
  locations,
  regions,
  currentUser,
  onOpenNewTicket,
  onSelectTicket,
  onUpdateTicketStatus,
  onUpdateTicketPriority,
  onAssignTechnician,
  onDeleteTicket
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>(currentUser.id);

  // Filter to tickets for selected technician or current user
  const myTickets = tickets.filter(t => {
    if (selectedTechnicianId === 'ALL') return true;
    return t.assigned_technician_id === selectedTechnicianId;
  });

  const totalCount = myTickets.length;
  const newCount = myTickets.filter(t => t.status === 'NEW').length;
  const openCount = myTickets.filter(t => t.status === 'OPEN').length;
  const inProgressCount = myTickets.filter(t => t.status === 'IN PROGRESS').length;
  const resolvedCount = myTickets.filter(t => t.status === 'RESOLVED').length;
  const closedCount = myTickets.filter(t => t.status === 'CLOSED').length;

  const filteredTickets = myTickets.filter(t => {
    if (selectedFilter === 'new' && t.status !== 'NEW') return false;
    if (selectedFilter === 'open' && t.status !== 'OPEN') return false;
    if (selectedFilter === 'in_progress' && t.status !== 'IN PROGRESS') return false;
    if (selectedFilter === 'resolved' && t.status !== 'RESOLVED') return false;
    if (selectedFilter === 'closed' && t.status !== 'CLOSED') return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.ticket_number.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.location_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header (Matching Image 4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Observations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete incident and observation repository across all lifecycle states, stores, locations, and technician dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Operator selector for review */}
          <select
            value={selectedTechnicianId}
            onChange={e => setSelectedTechnicianId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value={currentUser.id}>Assigned to Me ({currentUser.name})</option>
            <option value="ALL">All Technician Queues</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Download PDF Report</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px]">
              {filteredTickets.length}
            </span>
          </button>

          <button
            onClick={onOpenNewTicket}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* 2. My Ticket Status Overview Cards (Matching Image 4) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              MY TICKET STATUS OVERVIEW
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
              {totalCount} Total
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Click any card below to filter the queue</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: OPEN TICKETS */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === 'open' ? 'all' : 'open')}
            className={`border rounded-xl p-4 transition-all cursor-pointer ${
              selectedFilter === 'open'
                ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="text-xs font-bold text-blue-900 uppercase">OPEN TICKETS</span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mb-3">Awaiting review, triage & technician dispatch</div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{openCount + newCount}</span>
                <span className="text-xs font-semibold text-blue-600">0% of queue</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 hover:text-blue-700 flex items-center gap-1">
                Filter Open →
              </span>
            </div>
          </div>

          {/* Card 2: IN PROGRESS */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === 'in_progress' ? 'all' : 'in_progress')}
            className={`border rounded-xl p-4 transition-all cursor-pointer ${
              selectedFilter === 'in_progress'
                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20'
                : 'bg-white border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold text-amber-900 uppercase">IN PROGRESS</span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mb-3">Under active field diagnosis, parts replacement & repair</div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{inProgressCount}</span>
                <span className="text-xs font-semibold text-amber-600">0% of queue</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 hover:text-amber-700 flex items-center gap-1">
                Filter Progress →
              </span>
            </div>
          </div>

          {/* Card 3: RESOLVED */}
          <div
            onClick={() => setSelectedFilter(selectedFilter === 'resolved' ? 'all' : 'resolved')}
            className={`border rounded-xl p-4 transition-all cursor-pointer ${
              selectedFilter === 'resolved'
                ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-emerald-900 uppercase">RESOLVED</span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mb-3">Verified functional, closed & completed operational logs</div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{resolvedCount + closedCount}</span>
                <span className="text-xs font-semibold text-emerald-600">0% resolution rate</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1">
                Filter Resolved →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar (Matching Image 4) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> FILTER:
            </span>

            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Observations <span className="ml-1 opacity-80">{totalCount}</span>
            </button>

            <button
              onClick={() => setSelectedFilter('new')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'new'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              ● New <span className="ml-1 opacity-80">{newCount}</span>
            </button>

            <button
              onClick={() => setSelectedFilter('open')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'open'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              ● Open <span className="ml-1 opacity-80">{openCount}</span>
            </button>

            <button
              onClick={() => setSelectedFilter('in_progress')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'in_progress'
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              ● In Progress <span className="ml-1 opacity-80">{inProgressCount}</span>
            </button>

            <button
              onClick={() => setSelectedFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'resolved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              ● Resolved <span className="ml-1 opacity-80">{resolvedCount}</span>
            </button>

            <button
              onClick={() => setSelectedFilter('closed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === 'closed'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Closed <span className="ml-1 opacity-80">{closedCount}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ticket #, subject, or location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Table (Matching Image 4) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-emerald-600" />
                </th>
                <th className="py-3.5 px-4">TICKET #</th>
                <th className="py-3.5 px-4">CREATED DATE ↓</th>
                <th className="py-3.5 px-4">SUBJECT / TITLE</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4">PRIORITY</th>
                <th className="py-3.5 px-4">SLA STATUS</th>
                <th className="py-3.5 px-4">ASSIGNED TECHNICIAN</th>
                <th className="py-3.5 px-4">LOCATION / SITE</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">Showing 0 observations</p>
                    <p className="text-xs mt-1">No pending tickets currently assigned to this queue.</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                      <button onClick={() => onSelectTicket(ticket)} className="hover:underline">
                        {ticket.ticket_number}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {new Date(ticket.created_at).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {ticket.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-700 font-bold text-[10px]">● {ticket.sla_status}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                        {ticket.assigned_technician_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      {ticket.location_name}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectTicket(ticket)}
                        className="p-1 text-slate-500 hover:text-slate-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
