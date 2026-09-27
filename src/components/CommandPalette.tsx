import React, { useState, useEffect } from 'react';
import { Search, Ticket as TicketIcon, Building2, User as UserIcon, Shield, X } from 'lucide-react';
import { Ticket, Location, User } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  locations: Location[];
  users: User[];
  onSelectTicket: (t: Ticket) => void;
  onNavigateTab: (tab: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  tickets,
  locations,
  users,
  onSelectTicket,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTickets = tickets.filter(t =>
    t.ticket_number.toLowerCase().includes(query.toLowerCase()) ||
    t.subject.toLowerCase().includes(query.toLowerCase()) ||
    t.location_name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.branch_code.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden space-y-2">
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search tickets, branch sites, operators, or jump to views..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Jump Views */}
          <div>
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Quick Navigation Views
            </div>
            <div className="grid grid-cols-2 gap-1 px-1">
              {[
                { label: 'Dashboard Overview', tab: 'dashboard' },
                { label: 'Incident Observations', tab: 'observations' },
                { label: 'Technician Tickets', tab: 'technician-tickets' },
                { label: 'Locations & Regions', tab: 'locations' },
                { label: 'SLA Engine & Policies', tab: 'sla-engine' },
                { label: 'Audit Trail Ledger', tab: 'audit-trail' },
                { label: 'Administration Portal', tab: 'administration' }
              ].map(item => (
                <button
                  key={item.tab}
                  onClick={() => {
                    onNavigateTab(item.tab);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium truncate"
                >
                  → {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets Results */}
          {filteredTickets.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Tickets
              </div>
              <div className="space-y-1">
                {filteredTickets.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTicket(t);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div className="truncate">
                      <span className="font-mono font-bold text-amber-600 mr-2">{t.ticket_number}</span>
                      <span className="font-medium text-slate-900">{t.subject}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({t.location_name})</span>
                    </div>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                      {t.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Locations Results */}
          {filteredLocations.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Branches ({filteredLocations.length})
              </div>
              <div className="space-y-1">
                {filteredLocations.map(l => (
                  <button
                    key={l.id}
                    onClick={() => {
                      onNavigateTab('locations');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <span>{l.name} ({l.branch_code})</span>
                    <span className="text-[10px] text-slate-400">{l.region_name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
