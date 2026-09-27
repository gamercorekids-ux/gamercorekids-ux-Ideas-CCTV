import {
  Department,
  Region,
  Location,
  User,
  Ticket,
  TicketComment,
  AuditLog,
  SlaRule,
  SystemSettings,
  DbStatus
} from './types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchDbStatus(): Promise<DbStatus> {
  const res = await fetch(`${API_BASE}/db/status`);
  return res.json();
}

export async function testDbConnection(config: any): Promise<DbStatus> {
  const res = await fetch(`${API_BASE}/db/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return res.json();
}

export async function saveAndSyncDb(adminUser: string): Promise<{ success: boolean; message: string; status: DbStatus }> {
  const res = await fetch(`${API_BASE}/db/save-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminUser })
  });
  return res.json();
}

export async function fetchDepartments(): Promise<Department[]> {
  const res = await fetch(`${API_BASE}/departments`);
  return res.json();
}

export async function createDepartment(dept: Partial<Department>): Promise<Department> {
  const res = await fetch(`${API_BASE}/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dept)
  });
  const data = await res.json();
  return data.department;
}

export async function updateDepartment(id: string, updates: Partial<Department>): Promise<Department> {
  const res = await fetch(`${API_BASE}/departments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  return data.department;
}

export async function deleteDepartment(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/departments/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
}

export async function fetchRegions(): Promise<Region[]> {
  const res = await fetch(`${API_BASE}/regions`);
  return res.json();
}

export async function createRegion(region: Partial<Region>): Promise<Region> {
  const res = await fetch(`${API_BASE}/regions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(region)
  });
  const data = await res.json();
  return data.region;
}

export async function updateRegion(id: string, updates: Partial<Region>): Promise<Region> {
  const res = await fetch(`${API_BASE}/regions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  return data.region;
}

export async function deleteRegion(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/regions/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
}

export async function fetchLocations(): Promise<Location[]> {
  const res = await fetch(`${API_BASE}/locations`);
  return res.json();
}

export async function createLocation(loc: Partial<Location>): Promise<Location> {
  const res = await fetch(`${API_BASE}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loc)
  });
  const data = await res.json();
  return data.location;
}

export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location> {
  const res = await fetch(`${API_BASE}/locations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  return data.location;
}

export async function deleteLocation(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/locations/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

export async function createUser(user: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  const data = await res.json();
  return data.user;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  return data.user;
}

export async function deleteUser(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
}

export async function fetchTickets(deptId?: string): Promise<Ticket[]> {
  const url = deptId && deptId !== 'all' ? `${API_BASE}/tickets?department=${deptId}` : `${API_BASE}/tickets`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchTicketById(id: string): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets/${id}`);
  return res.json();
}

export async function createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticket)
  });
  const data = await res.json();
  return data.ticket;
}

export async function updateTicket(id: string, updates: Partial<Ticket>, adminUser?: any): Promise<Ticket> {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...updates, adminUser })
  });
  const data = await res.json();
  return data.ticket;
}

export async function deleteTicket(id: string, adminUser?: any): Promise<boolean> {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ adminUser })
  });
  const data = await res.json();
  return data.success;
}

export async function addTicketComment(ticketId: string, commentData: Partial<TicketComment>): Promise<TicketComment> {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData)
  });
  const data = await res.json();
  return data.comment;
}

export async function fetchSlaRules(): Promise<SlaRule[]> {
  const res = await fetch(`${API_BASE}/sla/rules`);
  return res.json();
}

export async function updateSlaRule(id: string, updates: Partial<SlaRule>): Promise<SlaRule> {
  const res = await fetch(`${API_BASE}/sla/rules/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  const data = await res.json();
  return data.rule;
}

export async function fetchAuditLogs(scope?: string): Promise<AuditLog[]> {
  const url = scope && scope !== 'All Events' ? `${API_BASE}/audit-logs?scope=${encodeURIComponent(scope)}` : `${API_BASE}/audit-logs`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchSettings(): Promise<SystemSettings> {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

export async function updateSettings(section: string, data: any, adminName?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/settings/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, adminName })
  });
  const resData = await res.json();
  return resData.settings;
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/auth/verify-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  return !!data.verified;
}
