import React, { useState } from 'react';
import {
  X,
  Clock,
  MapPin,
  User,
  Shield,
  Send,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { Ticket, User as AppUser } from '../types';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  users: AppUser[];
  currentUser: AppUser;
  onClose: () => void;
  onUpdateStatus: (ticketId: string, status: any) => void;
  onUpdatePriority: (ticketId: string, priority: any) => void;
  onAssignTechnician: (ticketId: string, technicianId: string, technicianName: string) => void;
  onAddComment: (ticketId: string, comment: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  users,
  currentUser,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onAssignTechnician,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');

  if (!ticket) return null;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(ticket.id, commentText);
    setCommentText('');
  };

  const priorityBadgeStyle = {
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
    HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
    MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
    LOW: 'bg-slate-50 text-slate-700 border-slate-200'
  }[ticket.priority];

  const statusBadgeStyle = {
    NEW: 'bg-blue-50 text-blue-700 border-blue-200',
    OPEN: 'bg-sky-50 text-sky-700 border-sky-200',
    'IN PROGRESS': 'bg-amber-50 text-amber-700 border-amber-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CLOSED: 'bg-slate-100 text-slate-700 border-slate-200'
  }[ticket.status];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-amber-600">{ticket.ticket_number}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${statusBadgeStyle}`}>
                {ticket.status}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${priorityBadgeStyle}`}>
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{ticket.subject}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>Department: <strong className="text-slate-700">{ticket.department_name}</strong></span>
              <span>•</span>
              <span>Created: {new Date(ticket.created_at).toLocaleString()}</span>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operational Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">LOCATION & REGION</div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{ticket.location_name}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{ticket.region_name} Region</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">ASSIGNED OPERATOR</div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs mt-1">
              <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{ticket.assigned_technician_name}</span>
            </div>
            <select
              value={ticket.assigned_technician_id || ''}
              onChange={e => {
                const u = users.find(usr => usr.id === e.target.value);
                onAssignTechnician(ticket.id, e.target.value, u ? u.name : 'Unassigned');
              }}
              className="mt-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none w-full"
            >
              <option value="">Unassigned</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">SLA RESOLUTION TIMER</div>
            <div className="flex items-center gap-1.5 font-bold text-emerald-700 text-xs mt-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{ticket.sla_status} ({ticket.sla_remaining_hours}h left)</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>

        {/* Quick Lifecycle Controls */}
        <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl flex-wrap text-xs font-semibold">
          <span className="text-slate-500 text-[11px] uppercase mr-2 font-bold">Lifecycle State:</span>
          {['NEW', 'OPEN', 'IN PROGRESS', 'RESOLVED', 'CLOSED'].map(st => (
            <button
              key={st}
              onClick={() => onUpdateStatus(ticket.id, st)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                ticket.status === st
                  ? 'bg-[#0F2942] text-white shadow-2xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Incident Narrative & Findings</label>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed font-medium">
            {ticket.description || 'No diagnostic notes attached to this ticket.'}
          </div>
        </div>

        {/* Photographic Evidence Gallery */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Photographic Evidence & Site Verification</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Policy: Max 2 MB / Image</span>
          </div>

          {ticket.evidence_images && ticket.evidence_images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ticket.evidence_images.map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video group">
                  <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
              No photographic evidence currently attached.
            </div>
          )}
        </div>

        {/* Internal Activity & Comments Thread */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Investigation Activity Log ({ticket.comments?.length || 0})
          </h4>

          <div className="space-y-2.5 max-h-48 overflow-y-auto">
            {ticket.comments?.map(cmt => (
              <div key={cmt.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-slate-900">{cmt.user_name} ({cmt.user_role})</span>
                  <span className="text-slate-400 font-mono">{new Date(cmt.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-700 leading-normal">{cmt.comment}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Add technician comment or diagnostic update..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F2942] hover:bg-[#163859] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
            >
              <Send className="w-3 h-3" />
              <span>Post Note</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
