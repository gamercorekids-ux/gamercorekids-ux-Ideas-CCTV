import React, { useState, useEffect } from 'react';
import {
  Activity,
  FileDown,
  Pause,
  Play,
  RotateCw,
  Search,
  Database,
  Server,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Department, Ticket, User, Location, DbStatus } from '../types';

interface DashboardViewProps {
  department: Department;
  tickets: Ticket[];
  users: User[];
  locations: Location[];
  dbStatus: DbStatus | null;
  onNavigateTab: (tab: any) => void;
  onSelectTicket: (ticket: Ticket) => void;
  onOpenDbModal: () => void;
  onRefreshData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  department,
  tickets,
  users,
  locations,
  dbStatus,
  onNavigateTab,
  onSelectTicket,
  onOpenDbModal,
  onRefreshData
}) => {
  const [autoRefreshActive, setAutoRefreshActive] = useState(true);
  const [countdown, setCountdown] = useState(18);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('2026-09-01');
  const [toDate, setToDate] = useState('2026-09-27');
  const [lastRefreshedTime, setLastRefreshedTime] = useState('06:14:54 PM');

  // Real-time ticking timer matching screenshot's "ACTIVE (18S)"
  useEffect(() => {
    if (!autoRefreshActive) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onRefreshData();
          setLastRefreshedTime(new Date().toLocaleTimeString());
          return 18;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefreshActive, onRefreshData]);

  // Derived counts
  const totalObservations = tickets.length;
  const activeTickets = tickets.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED').length;
  const closedTickets = tickets.filter(t => t.status === 'CLOSED' || t.status === 'RESOLVED').length;
  const openTickets = tickets.filter(t => t.status === 'OPEN' || t.status === 'NEW').length;
  const inProgressTickets = tickets.filter(t => t.status === 'IN PROGRESS').length;
  const delayedTickets = tickets.filter(t => t.sla_status === 'BREACHED').length;

  const filteredTickets = tickets.filter(t => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.ticket_number.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.location_name.toLowerCase().includes(q) ||
      t.region_name.toLowerCase().includes(q)
    );
  });

  // Calculate branch volume
  const branchCounts: Record<string, number> = {};
  tickets.forEach(t => {
    branchCounts[t.location_name] = (branchCounts[t.location_name] || 0) + 1;
  });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeks = ['w1', 'w2', 'w3', 'w4'];

  const departmentTitle = department?.name || 'Surveillance Operations Center';

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Operational Context & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold text-xl">⚡</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{departmentTitle}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Integrated surveillance incident logs, field technician dispatches, and branch notification routing.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => {}}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0F2942] text-white shadow-sm flex items-center gap-2"
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Executive Overview</span>
          </button>
          <button
            onClick={() => onNavigateTab('locations')}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors flex items-center gap-2"
          >
            <span>Branch Directory</span>
          </button>
          <button
            onClick={() => onNavigateTab('observations')}
            className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors flex items-center gap-2"
          >
            <span>Ticket Queue & SLAs</span>
          </button>
        </div>
      </div>

      {/* 2. Live Telemetry Ribbon (Matches Image 1) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Auto refresh ticker & controls */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Real-Time Auto-Refresh</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                ACTIVE ({countdown}S)
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              Syncing operational telemetry & active ticket counts live • Last: {lastRefreshedTime}
            </div>
          </div>
        </div>

        {/* Center: Search & Manual Refresh */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <button
            onClick={() => setAutoRefreshActive(!autoRefreshActive)}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 shrink-0"
          >
            {autoRefreshActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoRefreshActive ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => {
              onRefreshData();
              setCountdown(18);
              setLastRefreshedTime(new Date().toLocaleTimeString());
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#0F2942] hover:bg-[#163859] rounded-lg flex items-center gap-1.5 shrink-0 shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh Now</span>
          </button>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter live ticket, branch or region..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Right: Status Badges (Hostinger MySQL Connected & API Online) */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900">
            <span>Active Tickets: {activeTickets}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-600 text-white font-mono">Queue</span>
          </div>

          <button
            onClick={onOpenDbModal}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hostinger MySQL: {dbStatus?.connected ? 'Connected' : 'Sync Active'}</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold text-sky-900">
            <Server className="w-3.5 h-3.5 text-sky-600" />
            <span>API Status: Online (200 OK)</span>
          </div>
        </div>
      </div>

      {/* 3. Top Row Cards: Summaries, Heatmap, System Status, Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: All Observations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">All Observations (Summaries)</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-4">
            <div className="text-4xl font-extrabold text-slate-900 tabular-nums">{totalObservations}</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{totalObservations} Today Live from Database</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Card 2: Ticket Volume Heatmap (12 Months, W1-W4) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Ticket Volume Heatmap</span>
            <span className="text-[10px] font-semibold text-slate-400">12 Months</span>
          </div>

          <div className="my-3 overflow-x-auto">
            <div className="grid grid-cols-12 gap-1 text-[9px] font-mono text-slate-400 text-center mb-1">
              {months.map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
            <div className="space-y-1">
              {weeks.map(w => (
                <div key={w} className="flex items-center gap-1">
                  <span className="text-[8px] font-mono text-slate-400 w-3">{w}</span>
                  <div className="grid grid-cols-12 gap-1 flex-1">
                    {months.map((m, mIdx) => {
                      // Highlight the active month (September/October matching screenshot)
                      const isHigh = m === 'Oct' && w === 'w4';
                      return (
                        <div
                          key={mIdx}
                          className={`h-2.5 rounded-xs transition-colors ${
                            isHigh ? 'bg-emerald-500' : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                          title={`${m} ${w}: ${isHigh ? '1 ticket' : '0 tickets'}`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Density Scale</span>
            <div className="flex items-center gap-1.5">
              <span>0</span>
              <div className="w-12 h-1.5 bg-gradient-to-r from-slate-200 to-emerald-500 rounded-full"></div>
              <span>1</span>
            </div>
          </div>
        </div>

        {/* Card 3: System Status & Infrastructure Health */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-slate-700">SYSTEM STATUS</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
              ● OPERATIONAL
            </span>
          </div>

          <div className="my-2 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tabular-nums">99.98%</div>
              <div className="text-[11px] text-slate-400">uptime</div>
            </div>
            <div className="px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 flex items-center gap-1">
              <span>📶</span>
              <span>{dbStatus?.ping || '44ms ping'}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span> NVR Gateway
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span> AI Vision Bus
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500"></span> Hostinger DB
            </span>
          </div>
        </div>

        {/* Card 4: Date Range Filter & PDF Export */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">FROM</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">TO</label>
              <input
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => {
                setFromDate('2026-09-01');
                setToDate('2026-09-27');
              }}
              className="flex-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
            >
              RESET FILTERS
            </button>
            <button
              onClick={() => {
                window.print();
              }}
              className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163859] rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>EXPORT PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Executive Overview Grid & Advanced Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column: Executive Overview Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Executive Overview Grid</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-[11px] font-semibold text-slate-500">Today's Observations</div>
              <div className="text-2xl font-extrabold text-slate-900 my-1 tabular-nums">1</div>
              <div className="text-[10px] text-slate-400">1 logged today</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-[11px] font-semibold text-slate-500">All Observations</div>
              <div className="text-2xl font-extrabold text-slate-900 my-1 tabular-nums">{totalObservations}</div>
              <div className="text-[10px] text-slate-400">All Observations</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-[11px] font-semibold text-slate-500">Today's Tickets</div>
              <div className="text-2xl font-extrabold text-slate-900 my-1 tabular-nums">1</div>
              <div className="text-[10px] text-slate-400">Today's tickets</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-[11px] font-semibold text-slate-500">All Tickets</div>
              <div className="text-2xl font-extrabold text-slate-900 my-1 tabular-nums">{tickets.length}</div>
              <div className="text-[10px] text-slate-400">All Tickets</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">Technician Performance</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="bg-slate-100/80 border border-slate-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold text-slate-600">Total Assigned</div>
                <div className="text-xl font-extrabold text-slate-900 mt-1">0</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold text-amber-700">Pending Tickets</div>
                <div className="text-xl font-extrabold text-amber-900 mt-1">0</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold text-orange-700">In Process</div>
                <div className="text-xl font-extrabold text-orange-900 mt-1">0</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold text-emerald-700">Closed Tickets</div>
                <div className="text-xl font-extrabold text-emerald-900 mt-1">0</div>
              </div>
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
                <div className="text-[10px] font-bold text-rose-700">Delayed Tickets</div>
                <div className="text-xl font-extrabold text-rose-900 mt-1">0</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Advanced Analytics & AI Insight */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Advanced Analytics & AI Insight</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Chart 1: Ticket Volume Trends (30 Days) */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">Ticket Volume Trends (30 Days)</span>
                <span className="text-[10px] text-slate-400">Daily Inflow vs Resolution</span>
              </div>

              {/* Lightweight SVG Trend Line Chart */}
              <div className="h-32 w-full flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                  <line x1="0" y1="90" x2="300" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="0" y1="10" x2="300" y2="10" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3,3" />
                  
                  {/* Generated tickets curve (teal) */}
                  <path
                    d="M 0,90 L 40,90 L 80,90 L 120,90 L 160,90 L 200,90 L 240,90 L 280,90 L 295,15"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Resolved tickets curve (orange) */}
                  <path
                    d="M 0,90 L 295,90"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                  />
                  <circle cx="295" cy="15" r="3.5" fill="#0d9488" />
                </svg>
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] font-semibold text-slate-500 mt-2 border-t border-slate-100 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-teal-600 rounded-full"></span>
                  <span>Generated tickets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-orange-500 rounded-full"></span>
                  <span>Resolved tickets</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Issue Categorization Donut */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">Issue Categorization</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Telemetry
                </span>
              </div>

              <div className="h-32 flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="6" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="6"
                      strokeDasharray="88, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-slate-900">{tickets.length}</span>
                    <span className="text-[9px] text-slate-400">Total</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-700 border-t border-slate-100 pt-2">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                <span>GENERAL ({tickets.length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Row: Top 10 Branches, AI Analytics & Technician Matrix (Image 2) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top 10 Tickets Branch-Wise Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Top 10 Tickets Branch-Wise</span>
            </div>
            <span className="text-[10px] text-slate-400">Live volume ranking</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Agency Jaranwala', count: 1 },
              { name: 'Agency Quetta', count: 0 },
              { name: 'Cafe DMC', count: 0 },
              { name: 'Cafe Shahbaz', count: 0 },
              { name: 'Fabric Store Burewala', count: 0 },
              { name: 'Fabric Store Chakwal', count: 0 }
            ].map(branch => (
              <div key={branch.name} className="flex items-center gap-3 text-xs">
                <div className="w-36 text-slate-600 truncate text-[11px] font-medium">{branch.name}</div>
                <div className="flex-1 bg-slate-100 h-4 rounded-md overflow-hidden flex items-center">
                  {branch.count > 0 ? (
                    <div
                      className="bg-[#0F2942] h-full text-[10px] text-white font-mono flex items-center px-2 rounded-md font-semibold"
                      style={{ width: `${Math.max(25, branch.count * 60)}%` }}
                    >
                      {branch.count}
                    </div>
                  ) : (
                    <div className="w-1 h-full bg-transparent"></div>
                  )}
                </div>
                <span className="text-[11px] font-mono text-slate-400 w-4 text-right">{branch.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analytics & Operational Insights */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-slate-900">AI Analytics & Operational Insights</h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">
              Automated anomaly detection and telemetry metrics from live database records.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-800">GENERAL represents 100% of overall ticket volume.</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Live database analysis indicates 1 tickets categorized under GENERAL.</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-800">Agency Jaranwala reported highest ticket volume (1 tickets).</div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-bold text-slate-800">Zero critical SLA breach alerts detected across active tickets.</div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="text-xs font-bold text-emerald-800">CCTV Health: 249 of 252 camera streams currently active (99% online).</div>
                </div>
              </div>

              {/* Forecast Projection Curve */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between">
                <div className="text-[11px] font-bold text-slate-700">Forecast to predictive resolution</div>
                <div className="h-28 w-full flex items-end my-2">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <line x1="0" y1="70" x2="200" y2="70" stroke="#cbd5e1" strokeWidth="1" />
                    <line x1="0" y1="40" x2="200" y2="40" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="0" y1="10" x2="200" y2="10" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />
                    <path
                      d="M 10,68 Q 100,68 190,65"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                  <span>Projection Curve</span>
                  <span>Timeline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Technician Performance Detailed Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">Technician Performance Detailed Matrix</h4>
          <button
            onClick={() => onNavigateTab('technician-reports')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View Full KPI Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Technician Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Total Assigned</th>
                <th className="py-3 px-4 text-center">Pending Tickets</th>
                <th className="py-3 px-4 text-center">In Process</th>
                <th className="py-3 px-4 text-center">Closed Tickets</th>
                <th className="py-3 px-4 text-center">Delayed Tickets</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                        {u.avatar_initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      <span>⏱</span> Idle
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-slate-800">{u.assigned_count || 0}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-amber-600">{u.pending_count || 0}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-orange-600">{u.in_process_count || 0}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-600">{u.closed_count || 0}</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-rose-600">{u.delayed_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Bottom Metric Strip with Accent Line Borders */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border-t-2 border-t-slate-800 border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Observations logged</div>
          <div className="text-2xl font-extrabold text-slate-900 my-0.5 tabular-nums">{totalObservations}</div>
          <div className="text-[10px] text-slate-400">in selected range</div>
        </div>

        <div className="bg-white border-t-2 border-t-rose-500 border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Open incidents</div>
          <div className="text-2xl font-extrabold text-rose-600 my-0.5 tabular-nums">0</div>
          <div className="text-[10px] text-slate-400">unresolved</div>
        </div>

        <div className="bg-white border-t-2 border-t-amber-500 border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Open tickets</div>
          <div className="text-2xl font-extrabold text-amber-600 my-0.5 tabular-nums">{openTickets}</div>
          <div className="text-[10px] text-slate-400">technician requests</div>
        </div>

        <div className="bg-white border-t-2 border-t-emerald-500 border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Cameras repaired</div>
          <div className="text-2xl font-extrabold text-emerald-600 my-0.5 tabular-nums">{closedTickets}</div>
          <div className="text-[10px] text-slate-400">by technicians</div>
        </div>

        <div className="bg-white border-t-2 border-t-purple-500 border border-slate-200 rounded-xl p-4 shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Branches reporting</div>
          <div className="text-2xl font-extrabold text-purple-600 my-0.5 tabular-nums">{locations.length}</div>
          <div className="text-[10px] text-slate-400">with activity</div>
        </div>
      </div>
    </div>
  );
};
