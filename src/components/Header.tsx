import React, { useState } from 'react';
import { Search, Bell, CheckCircle2, AlertTriangle, Shield, RefreshCw, Database, ChevronDown, LogOut } from 'lucide-react';
import { Department, User, DbStatus } from '../types';

interface HeaderProps {
  currentTab: string;
  departments: Department[];
  activeDepartmentId: string;
  onSelectDepartment: (id: string) => void;
  currentUser: User;
  users: User[];
  onSwitchUser: (user: User) => void;
  dbStatus: DbStatus | null;
  onOpenCommandPalette: () => void;
  onOpenDbModal: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  departments,
  activeDepartmentId,
  onSelectDepartment,
  currentUser,
  users,
  onSwitchUser,
  dbStatus,
  onOpenCommandPalette,
  onOpenDbModal,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDeptMenu, setShowDeptMenu] = useState(false);

  const activeDept = departments.find(d => d.id === activeDepartmentId) || departments[0];

  const recentAlerts = [
    { id: 1, title: 'CCTV Stream Normalized', time: '4m ago', type: 'info', location: 'Agency Jaranwala' },
    { id: 2, title: 'New Incident CMP-2026-531656', time: '12m ago', type: 'warning', location: 'Agency Jaranwala' },
    { id: 3, title: 'Hostinger MySQL Heartbeat OK', time: '20m ago', type: 'success', location: 'Database Cluster' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Current View */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-[#09151F] text-white px-2.5 py-1.5 rounded-lg border border-slate-800 shadow-sm">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm"></div>
            </div>
            <span className="font-mono text-xs font-bold tracking-wider text-emerald-400">OPS</span>
          </div>

          <div className="h-5 w-px bg-slate-200"></div>

          <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 capitalize">
            {currentTab.replace('-', ' ')}
          </h1>

          {/* Department Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDeptMenu(!showDeptMenu)}
              className="flex items-center gap-2 px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate max-w-[130px] sm:max-w-none">{activeDept?.name || 'All Departments'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showDeptMenu && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Operational Scope
                </div>
                <button
                  onClick={() => {
                    onSelectDepartment('all');
                    setShowDeptMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    activeDepartmentId === 'all' ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>All Operational Units (Global)</span>
                  {activeDepartmentId === 'all' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                {departments.map(dept => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      onSelectDepartment(dept.id);
                      setShowDeptMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      activeDepartmentId === dept.id ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate font-medium">{dept.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{dept.code} · {dept.description}</div>
                    </div>
                    {activeDepartmentId === dept.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Portal with ⌘K */}
        <div className="flex-1 max-w-xl hidden md:block">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-sm bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shadow-2xs group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              <span className="text-xs text-slate-400">Search portal, branch, ticket #, or technician...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: DB Status Pill, Notification Bell, User Account */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Hostinger DB Status Trigger */}
          <button
            onClick={onOpenDbModal}
            title="Inspect Hostinger MySQL Connectivity & Sync Ledger"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-md text-[11px] font-semibold text-emerald-800 transition-colors"
          >
            <Database className="w-3 h-3 text-emerald-600" />
            <span>Hostinger MySQL: {dbStatus?.connected ? 'Connected' : 'Sync Active'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live System Alerts</span>
                  <span className="text-[10px] text-slate-400">3 unread</span>
                </div>
                <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                  {recentAlerts.map(alert => (
                    <div key={alert.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                        <span>{alert.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{alert.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{alert.location}</div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Mark all alerts as acknowledged
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200"></div>

          {/* User Account & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 text-left p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-100">
                  {currentUser.avatar_initials || 'SU'}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-semibold text-slate-900 leading-tight truncate max-w-[130px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <div className="font-semibold text-xs text-slate-900">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{currentUser.email}</div>
                  <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {currentUser.role} · Active Session
                  </div>
                </div>

                <div className="px-4 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role Profile
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentUser.id === u.id ? 'bg-emerald-50/50 font-semibold text-emerald-800' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.role} · {u.department_name}</div>
                      </div>
                      {currentUser.id === u.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-slate-100 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenDbModal();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"
                  >
                    <Database className="w-3.5 h-3.5 text-slate-500" />
                    <span>Hostinger MySQL Sync Status</span>
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-2 font-medium transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Lock & Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
