import React from 'react';
import {
  LayoutDashboard,
  Eye,
  ShieldAlert,
  Building2,
  BarChart3,
  Clock,
  Users,
  ScrollText,
  SlidersHorizontal
} from 'lucide-react';
import { User } from '../types';

export type TabId =
  | 'dashboard'
  | 'observations'
  | 'technician-tickets'
  | 'locations'
  | 'technician-reports'
  | 'sla-engine'
  | 'users-teams'
  | 'audit-trail'
  | 'administration';

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  currentUser: User;
  ticketsCount: number;
  slaEngineEnabled?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  ticketsCount,
  slaEngineEnabled = true
}) => {
  const tabs: { id: TabId; label: string; icon: React.ComponentType<any>; badge?: number; minRole?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'observations', label: 'Observations', icon: Eye, badge: ticketsCount },
    { id: 'technician-tickets', label: 'Technician Tickets', icon: ShieldAlert },
    { id: 'locations', label: 'Locations', icon: Building2 },
    { id: 'technician-reports', label: 'Technician Performance & Reports', icon: BarChart3 },
    { id: 'sla-engine', label: 'SLA Engine & Policies', icon: Clock },
    { id: 'users-teams', label: 'Users & Teams', icon: Users },
    { id: 'audit-trail', label: 'Audit Trail', icon: ScrollText },
    { id: 'administration', label: 'Administration', icon: SlidersHorizontal, minRole: 'SUPER_ADMIN' }
  ];

  // Filter based on user role (Super Admins see all, supervisors see operational tabs, technicians see assigned)
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isTechnician = currentUser.role === 'TECHNICIAN';

  return (
    <nav className="bg-[#09151F] text-slate-300 border-b border-slate-800 shadow-md">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6">
        <div className="flex items-center gap-1.5 py-2 overflow-x-auto no-scrollbar">
          {tabs.map(tab => {
            // Technicians can ONLY see Dashboard and Technician Tickets
            if (isTechnician && tab.id !== 'dashboard' && tab.id !== 'technician-tickets') {
              return null;
            }
            if (tab.minRole === 'SUPER_ADMIN' && !isSuperAdmin) {
              return null;
            }
            if (tab.id === 'sla-engine' && !slaEngineEnabled) {
              return null;
            }

            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-500/40 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
