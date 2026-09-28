import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Department,
  Region,
  Location,
  User,
  Ticket,
  SlaRule,
  AuditLog,
  SystemSettings,
  DbStatus
} from './types';
import * as api from './api';
import { Header } from './components/Header';
import { Navigation, TabId } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ObservationsView } from './components/ObservationsView';
import { TechnicianTicketsView } from './components/TechnicianTicketsView';
import { LocationsView } from './components/LocationsView';
import { TechnicianReportsView } from './components/TechnicianReportsView';
import { SlaEngineView } from './components/SlaEngineView';
import { UsersTeamsView } from './components/UsersTeamsView';
import { AuditTrailView } from './components/AuditTrailView';
import { AdministrationView } from './components/AdministrationView';
import { TicketDetailModal } from './components/TicketDetailModal';
import { NewTicketModal } from './components/NewTicketModal';
import { HostingerDbModal } from './components/HostingerDbModal';
import { CommandPalette } from './components/CommandPalette';
import { LoginPage } from './components/LoginPage';
import { ToastProvider, useToast } from './context/ToastContext';

function AppContent() {
  const {
    notifyTicketAssigned,
    notifyTicketStatusChanged,
    notifyUserStatusChanged,
    notifySuccess,
    notifyInfo
  } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('opsdesk_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [activeDepartmentId, setActiveDepartmentId] = useState<string>('all');
  const [regions, setRegions] = useState<Region[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = sessionStorage.getItem('opsdesk_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'admin-super',
      name: 'Super Admin',
      email: 'admin@ideas.com.pk',
      department_id: 'dept_surveillance',
      department_name: 'Security Operations & Surveillance',
      role: 'SUPER_ADMIN',
      status: 'Active',
      avatar_initials: 'AD',
      workload_status: 'Idle',
      granular_rights: ['Tickets', 'Resolve', 'Live Feeds', 'Users', 'Settings', 'Audit', 'Delete']
    };
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [slaRules, setSlaRules] = useState<SlaRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Reference trackers for background live toast alerts
  const prevTicketsMapRef = useRef<Map<string, Ticket>>(new Map());
  const prevUserRef = useRef<User | null>(null);
  const isInitialLoadRef = useRef(true);

  // Load all initial data from backend
  const loadData = useCallback(async (isBackgroundPoll = false) => {
    try {
      const [
        deptsRes,
        regsRes,
        locsRes,
        usersRes,
        ticketsRes,
        slaRes,
        auditRes,
        settingsRes,
        statusRes
      ] = await Promise.all([
        api.fetchDepartments(),
        api.fetchRegions(),
        api.fetchLocations(),
        api.fetchUsers(),
        api.fetchTickets(activeDepartmentId),
        api.fetchSlaRules(),
        api.fetchAuditLogs(),
        api.fetchSettings(),
        api.fetchDbStatus()
      ]);

      const fetchedTickets = Array.isArray(ticketsRes) ? ticketsRes : [];
      const fetchedUsers = Array.isArray(usersRes) ? usersRes : [];

      setDepartments(Array.isArray(deptsRes) ? deptsRes : []);
      setRegions(Array.isArray(regsRes) ? regsRes : []);
      setLocations(Array.isArray(locsRes) ? locsRes : []);
      setUsers(fetchedUsers);
      setTickets(fetchedTickets);
      setSlaRules(Array.isArray(slaRes) ? slaRes : []);
      setAuditLogs(Array.isArray(auditRes) ? auditRes : []);
      if (settingsRes) setSettings(settingsRes);
      if (statusRes) setDbStatus(statusRes);

      // Keep currentUser synced
      if (fetchedUsers.length > 0) {
        const matched = fetchedUsers.find(u => u.id === currentUser.id);
        if (matched) {
          // If background poll detected user status change
          if (isBackgroundPoll && prevUserRef.current) {
            if (prevUserRef.current.workload_status !== matched.workload_status) {
              notifyUserStatusChanged(
                matched,
                'workload',
                prevUserRef.current.workload_status,
                matched.workload_status
              );
            }
            if (prevUserRef.current.status !== matched.status) {
              notifyUserStatusChanged(
                matched,
                'status',
                prevUserRef.current.status,
                matched.status
              );
            }
          }
          prevUserRef.current = matched;
          setCurrentUser(matched);
        } else if (fetchedUsers.length > 0) {
          setCurrentUser(fetchedUsers[0]);
        }
      }

      // Live background detection for new ticket assignments or status updates
      if (isBackgroundPoll && !isInitialLoadRef.current) {
        fetchedTickets.forEach(ticket => {
          const prev = prevTicketsMapRef.current.get(ticket.id);
          const isAssignedToCurrent =
            ticket.assigned_technician_id === currentUser.id ||
            ticket.assigned_technician_name === currentUser.name;

          if (prev) {
            // Check assignment change
            const wasAssignedToCurrent =
              prev.assigned_technician_id === currentUser.id ||
              prev.assigned_technician_name === currentUser.name;

            if (!wasAssignedToCurrent && isAssignedToCurrent) {
              notifyTicketAssigned(ticket, 'You', (t) => {
                setSelectedTicket(t);
                setActiveTab('observations');
              });
            }

            // Check status change on tickets assigned to user or created by user
            if (prev.status !== ticket.status && (isAssignedToCurrent || ticket.created_by_user_id === currentUser.id)) {
              notifyTicketStatusChanged(ticket, prev.status, ticket.status, (t) => {
                setSelectedTicket(t);
                setActiveTab('observations');
              });
            }
          } else if (isAssignedToCurrent) {
            // Brand new ticket directly assigned to current user
            notifyTicketAssigned(ticket, 'You', (t) => {
              setSelectedTicket(t);
              setActiveTab('observations');
            });
          }
        });
      }

      // Update ref map for next comparison
      const newMap = new Map<string, Ticket>();
      fetchedTickets.forEach(t => newMap.set(t.id, t));
      prevTicketsMapRef.current = newMap;
      isInitialLoadRef.current = false;
    } catch {
      // Gracefully continue with available state
    } finally {
      setLoading(false);
    }
  }, [
    activeDepartmentId,
    currentUser.id,
    currentUser.name,
    notifyTicketAssigned,
    notifyTicketStatusChanged,
    notifyUserStatusChanged
  ]);

  useEffect(() => {
    loadData(false);
  }, [loadData]);

  // Periodic background sync every 12 seconds to alert user on remote changes
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      loadData(true);
    }, 12000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loadData]);

  // Global hotkey: ⌘K to open search command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Handlers ---
  const handleCreateTicket = async (ticketData: Partial<Ticket>) => {
    try {
      const created = await api.createTicket(ticketData);
      setTickets(prev => [created, ...prev]);
      prevTicketsMapRef.current.set(created.id, created);

      notifySuccess(
        `Ticket Created: ${created.ticket_number}`,
        `${created.subject} (${created.priority} Priority)`
      );

      // If assigned directly at creation
      if (
        created.assigned_technician_name &&
        (created.assigned_technician_id === currentUser.id || created.assigned_technician_name === currentUser.name)
      ) {
        notifyTicketAssigned(created, 'You', (t) => setSelectedTicket(t));
      }

      const logs = await api.fetchAuditLogs();
      setAuditLogs(logs);
      const status = await api.fetchDbStatus();
      setDbStatus(status);
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, status: any) => {
    try {
      const prevTicket = tickets.find(t => t.id === ticketId);
      const oldStatus = prevTicket ? prevTicket.status : 'OPEN';

      const updated = await api.updateTicket(ticketId, { status }, {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role
      });

      setTickets(prev => prev.map(t => (t.id === ticketId ? updated : t)));
      prevTicketsMapRef.current.set(updated.id, updated);
      if (selectedTicket?.id === ticketId) setSelectedTicket(updated);

      // Trigger Toast Alert
      notifyTicketStatusChanged(updated, oldStatus, status, (t) => {
        setSelectedTicket(t);
        setActiveTab('observations');
      });

      const logs = await api.fetchAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  const handleUpdateTicketPriority = async (ticketId: string, priority: any) => {
    try {
      const updated = await api.updateTicket(ticketId, { priority }, {
        id: currentUser.id,
        name: currentUser.name,
        role: currentUser.role
      });
      setTickets(prev => prev.map(t => (t.id === ticketId ? updated : t)));
      prevTicketsMapRef.current.set(updated.id, updated);
      if (selectedTicket?.id === ticketId) setSelectedTicket(updated);

      notifyInfo(`Priority Updated: ${updated.ticket_number}`, `Priority adjusted to ${priority}`);

      const logs = await api.fetchAuditLogs();
      setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to update ticket priority:', err);
    }
  };

  const handleAssignTechnician = async (ticketId: string, techId: string, techName: string) => {
    try {
      const updated = await api.updateTicket(
        ticketId,
        { assigned_technician_id: techId || null, assigned_technician_name: techName },
        { id: currentUser.id, name: currentUser.name, role: currentUser.role }
      );
      setTickets(prev => prev.map(t => (t.id === ticketId ? updated : t)));
      prevTicketsMapRef.current.set(updated.id, updated);
      if (selectedTicket?.id === ticketId) setSelectedTicket(updated);

      // Trigger Toast Alert for Assignment
      const isAssignedToMe = techId === currentUser.id || techName === currentUser.name;
      notifyTicketAssigned(
        updated,
        isAssignedToMe ? 'You' : techName,
        (t) => {
          setSelectedTicket(t);
          setActiveTab('observations');
        }
      );

      const logs = await api.fetchAuditLogs();
      setAuditLogs(logs);
      const usersList = await api.fetchUsers();
      setUsers(usersList);
    } catch (err) {
      console.error('Failed to assign technician:', err);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await api.deleteTicket(ticketId, { id: currentUser.id, name: currentUser.name, role: currentUser.role });
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      prevTicketsMapRef.current.delete(ticketId);
      if (selectedTicket?.id === ticketId) setSelectedTicket(null);
      notifyInfo('Ticket Removed', `Ticket #${ticketId} was successfully deleted.`);
      const logs = await api.fetchAuditLogs();
      setAuditLogs(logs);
      const status = await api.fetchDbStatus();
      setDbStatus(status);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
    }
  };

  const handleAddComment = async (ticketId: string, comment: string) => {
    try {
      const newComment = await api.addTicketComment(ticketId, {
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_role: currentUser.role,
        comment
      });
      setTickets(prev =>
        prev.map(t => {
          if (t.id === ticketId) {
            const comments = t.comments ? [...t.comments, newComment] : [newComment];
            const updated = { ...t, comments };
            if (selectedTicket?.id === ticketId) setSelectedTicket(updated);
            return updated;
          }
          return t;
        })
      );
      notifySuccess('Comment Recorded', 'Your update was posted to the compliance ledger.');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleAddBranch = async (loc: Partial<Location>) => {
    try {
      const created = await api.createLocation(loc);
      setLocations(prev => [created, ...prev]);
      notifySuccess(`Branch Added: ${created.name}`, `Code: ${created.branch_code}`);
    } catch (err) {
      console.error('Failed to add location:', err);
    }
  };

  const handleUpdateBranch = async (id: string, updates: Partial<Location>) => {
    try {
      const updated = await api.updateLocation(id, updates);
      setLocations(prev => prev.map(l => (l.id === id ? updated : l)));
      notifySuccess(`Branch Updated: ${updated.name}`);
    } catch (err) {
      console.error('Failed to update location:', err);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      await api.deleteLocation(id);
      setLocations(prev => prev.filter(l => l.id !== id));
      notifyInfo('Branch Removed', 'Location removed from operational network.');
    } catch (err) {
      console.error('Failed to delete location:', err);
    }
  };

  const handleCreateRegion = async (name: string, code: string) => {
    try {
      const created = await api.createRegion({ name, code, status: 'ACTIVE' });
      setRegions(prev => [...prev, created]);
      notifySuccess(`Region Registered: ${created.name}`);
    } catch (err) {
      console.error('Failed to create region:', err);
    }
  };

  const handleDeleteRegion = async (id: string) => {
    try {
      await api.deleteRegion(id);
      setRegions(prev => prev.filter(r => r.id !== id));
      notifyInfo('Region Removed', 'Regional zone removed.');
    } catch (err) {
      console.error('Failed to delete region:', err);
    }
  };

  const handleAddUser = async (userData: Partial<User>) => {
    try {
      const created = await api.createUser(userData);
      setUsers(prev => [...prev, created]);
      notifySuccess(`User Provisioned: ${created.name}`, `Role: ${created.role}`);
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleUpdateUser = async (id: string, updates: Partial<User>) => {
    try {
      const targetUser = users.find(u => u.id === id);
      const oldWorkload = targetUser?.workload_status;
      const oldStatus = targetUser?.status;

      const updated = await api.updateUser(id, updates);
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));

      // Alert toast when workload status or account status changes
      if (updates.workload_status && oldWorkload && updates.workload_status !== oldWorkload) {
        notifyUserStatusChanged(updated, 'workload', oldWorkload, updates.workload_status);
      } else if (updates.status && oldStatus && updates.status !== oldStatus) {
        notifyUserStatusChanged(updated, 'status', oldStatus, updates.status);
      } else {
        notifySuccess(`User Updated: ${updated.name}`);
      }

      if (currentUser.id === id) {
        setCurrentUser(updated);
      }
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      notifyInfo('User Account Removed');
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleAddDepartment = async (deptData: Partial<Department>) => {
    try {
      const created = await api.createDepartment(deptData);
      setDepartments(prev => [...prev, created]);
      notifySuccess(`Department Created: ${created.name}`);
    } catch (err) {
      console.error('Failed to create department:', err);
    }
  };

  const handleUpdateDepartment = async (id: string, updates: Partial<Department>) => {
    try {
      const updated = await api.updateDepartment(id, updates);
      setDepartments(prev => prev.map(d => (d.id === id ? updated : d)));
      notifySuccess(`Department Updated: ${updated.name}`);
    } catch (err) {
      console.error('Failed to update department:', err);
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    try {
      await api.deleteDepartment(id);
      setDepartments(prev => prev.filter(d => d.id !== id));
      notifyInfo('Department Removed');
    } catch (err) {
      console.error('Failed to delete department:', err);
    }
  };

  const handleUpdateSlaRule = async (id: string, updates: Partial<SlaRule>) => {
    try {
      const updated = await api.updateSlaRule(id, updates);
      setSlaRules(prev => prev.map(r => (r.id === id ? updated : r)));
      notifySuccess(`SLA Policy Updated: ${updated.priority_tier}`);
    } catch (err) {
      console.error('Failed to update SLA rule:', err);
    }
  };

  const handleUpdateSettings = async (section: string, data: any) => {
    try {
      const updated = await api.updateSettings(section, data);
      setSettings(updated);
      notifySuccess('System Configuration Saved');
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  const handleSyncDatabase = async () => {
    try {
      const res = await api.saveAndSyncDb(currentUser.name);
      setDbStatus(res.status);
      await loadData(false);
      notifySuccess('MySQL Synchronized', 'Hostinger operational ledger is in sync.');
    } catch (err) {
      console.error('Database sync failed:', err);
    }
  };

  const activeDept = departments.find(d => d.id === activeDepartmentId) || departments[0] || {
    id: 'dept_surveillance',
    code: 'SEC_SURV',
    name: 'Security Operations & Surveillance',
    description: 'Central Monitoring & Guard Dispatch',
    is_primary: true,
    status: 'active' as const
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09151F] text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-4 font-mono text-sm tracking-wider text-emerald-400 font-bold">
          INITIALIZING OPSDESK PORTAL
        </div>
        <div className="text-xs text-slate-400 mt-1">Connecting to Hostinger MySQL storage engine...</div>
      </div>
    );
  }

  // If user is not authenticated, render the custom enterprise login page matching image
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={user => {
          if (user) {
            setCurrentUser(user);
          }
          setIsAuthenticated(true);
        }}
        onBypassLogin={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col selection:bg-emerald-500/20 selection:text-emerald-800">
      {/* 1. Header (Sticky) */}
      <Header
        currentTab={activeTab}
        departments={departments}
        activeDepartmentId={activeDepartmentId}
        onSelectDepartment={id => setActiveDepartmentId(id)}
        currentUser={currentUser}
        users={users}
        onSwitchUser={u => setCurrentUser(u)}
        dbStatus={dbStatus}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onLogout={() => {
          sessionStorage.removeItem('opsdesk_auth');
          sessionStorage.removeItem('opsdesk_user');
          setIsAuthenticated(false);
        }}
      />

      {/* 2. Navigation Pill Bar (Sticky) */}
      <Navigation
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        currentUser={currentUser}
        ticketsCount={tickets.length}
      />

      {/* 3. Main View Area */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 lg:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            department={activeDept}
            tickets={tickets}
            users={users}
            locations={locations}
            dbStatus={dbStatus}
            onNavigateTab={tab => setActiveTab(tab)}
            onSelectTicket={t => setSelectedTicket(t)}
            onOpenDbModal={() => setIsDbModalOpen(true)}
            onRefreshData={() => loadData(false)}
          />
        )}

        {activeTab === 'observations' && (
          <ObservationsView
            tickets={tickets}
            users={users}
            locations={locations}
            regions={regions}
            currentUser={currentUser}
            onOpenNewTicket={() => setIsNewTicketOpen(true)}
            onSelectTicket={t => setSelectedTicket(t)}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onUpdateTicketPriority={handleUpdateTicketPriority}
            onAssignTechnician={handleAssignTechnician}
            onDeleteTicket={handleDeleteTicket}
          />
        )}

        {activeTab === 'technician-tickets' && (
          <TechnicianTicketsView
            tickets={tickets}
            users={users}
            locations={locations}
            regions={regions}
            currentUser={currentUser}
            onOpenNewTicket={() => setIsNewTicketOpen(true)}
            onSelectTicket={t => setSelectedTicket(t)}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onUpdateTicketPriority={handleUpdateTicketPriority}
            onAssignTechnician={handleAssignTechnician}
            onDeleteTicket={handleDeleteTicket}
          />
        )}

        {activeTab === 'locations' && (
          <LocationsView
            locations={locations}
            regions={regions}
            onAddBranch={handleAddBranch}
            onUpdateBranch={handleUpdateBranch}
            onDeleteBranch={handleDeleteBranch}
            onCreateRegion={handleCreateRegion}
            onDeleteRegion={handleDeleteRegion}
            onSyncData={handleSyncDatabase}
          />
        )}

        {activeTab === 'technician-reports' && (
          <TechnicianReportsView
            users={users}
            tickets={tickets}
            onSelectTicket={t => setSelectedTicket(t)}
          />
        )}

        {activeTab === 'sla-engine' && (
          <SlaEngineView
            rules={slaRules}
            onUpdateRule={handleUpdateSlaRule}
          />
        )}

        {activeTab === 'users-teams' && (
          <UsersTeamsView
            users={users}
            departments={departments}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onOpenManageDepartments={() => {
              setActiveTab('administration');
            }}
          />
        )}

        {activeTab === 'audit-trail' && (
          <AuditTrailView
            logs={auditLogs}
            onSyncDb={handleSyncDatabase}
          />
        )}

        {activeTab === 'administration' && (
          <AdministrationView
            settings={settings as any}
            departments={departments}
            locations={locations}
            users={users}
            logs={auditLogs}
            dbStatus={dbStatus}
            onUpdateSettings={handleUpdateSettings}
            onAddDepartment={handleAddDepartment}
            onUpdateDepartment={handleUpdateDepartment}
            onDeleteDepartment={handleDeleteDepartment}
            onSyncDb={handleSyncDatabase}
            onOpenDbModal={() => setIsDbModalOpen(true)}
          />
        )}
      </main>

      {/* 4. Modals */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          users={users}
          currentUser={currentUser}
          onClose={() => setSelectedTicket(null)}
          onUpdateStatus={handleUpdateTicketStatus}
          onUpdatePriority={handleUpdateTicketPriority}
          onAssignTechnician={handleAssignTechnician}
          onAddComment={handleAddComment}
        />
      )}

      {isNewTicketOpen && (
        <NewTicketModal
          departments={departments}
          locations={locations}
          users={users}
          currentUser={currentUser}
          onClose={() => setIsNewTicketOpen(false)}
          onSubmit={handleCreateTicket}
        />
      )}

      {isDbModalOpen && (
        <HostingerDbModal
          status={dbStatus}
          onClose={() => setIsDbModalOpen(false)}
          onTestConnection={api.testDbConnection}
          onSyncDatabase={handleSyncDatabase}
        />
      )}

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tickets={tickets}
        locations={locations}
        users={users}
        onSelectTicket={t => {
          setSelectedTicket(t);
          setActiveTab('observations');
        }}
        onNavigateTab={tab => setActiveTab(tab)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
