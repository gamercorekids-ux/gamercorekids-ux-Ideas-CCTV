import React, { useState } from 'react';
import {
  Users,
  Wrench,
  Building,
  Shield,
  Search,
  Plus,
  Edit2,
  Key,
  Ban,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  X
} from 'lucide-react';
import { User, Department } from '../types';

interface UsersTeamsViewProps {
  users: User[];
  departments: Department[];
  currentUser: User;
  onAddUser: (user: Partial<User>) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
  onOpenManageDepartments: () => void;
}

export const UsersTeamsView: React.FC<UsersTeamsViewProps> = ({
  users,
  departments,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onOpenManageDepartments
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || 'dept_surveillance');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'SUPERVISOR' | 'TECHNICIAN' | 'OPERATOR'>('TECHNICIAN');
  const [selectedRights, setSelectedRights] = useState<string[]>(['Tickets', 'Resolve']);

  const totalAuthorized = users.length;
  const techniciansCount = users.filter(u => u?.role === 'TECHNICIAN').length;
  const activeDeptsCount = departments.length;
  const securityAdminsCount = users.filter(
    u => u?.role === 'SUPER_ADMIN' || u?.role === 'SUPERVISOR'
  ).length;

  const filteredUsers = users.filter(u => {
    if (!u) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department_name.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (departmentFilter !== 'ALL' && u.department_id !== departmentFilter) return false;
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    return true;
  });

  const allAvailableRights = ['Tickets', 'Resolve', 'Live Feeds', 'Users', 'Settings', 'Audit', 'Delete', 'Assign'];

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('Password123!');
    setDepartmentId(departments[0]?.id || 'dept_surveillance');
    setRole('TECHNICIAN');
    setSelectedRights(['Tickets', 'Resolve']);
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setDepartmentId(user.department_id);
    setRole(user.role);
    setSelectedRights(user.granular_rights || ['Tickets', 'Resolve']);
    setShowAddModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === departmentId);
    const payload: Partial<User> = {
      name,
      email,
      department_id: departmentId,
      department_name: dept ? dept.name : 'Security Operations & Surveillance',
      role,
      granular_rights: selectedRights,
      status: 'Active'
    };
    if (password) payload.password = password;

    if (editingUser) {
      onUpdateUser(editingUser.id, payload);
    } else {
      onAddUser(payload);
    }

    setShowAddModal(false);
  };

  const handleCopyEmail = (emailStr: string) => {
    navigator.clipboard.writeText(emailStr);
    setCopiedEmail(emailStr);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Manage Departments & Add Member (Matching Image 8) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-800" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Users & Team Directory</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authorize technician login emails, assign departmental teams, and configure granular access rights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenManageDepartments}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage Departments</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Member / Technician</span>
          </button>
        </div>
      </div>

      {/* 2. Four Stat Cards (Matching Image 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Authorized */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">TOTAL AUTHORIZED</div>
            <div className="text-3xl font-extrabold text-slate-900 my-1 tabular-nums">{totalAuthorized}</div>
            <div className="text-[11px] text-slate-400">{totalAuthorized} active in system</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Technicians & Field */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">TECHNICIANS & FIELD</div>
            <div className="text-3xl font-extrabold text-slate-900 my-1 tabular-nums">{techniciansCount}</div>
            <div className="text-[11px] text-blue-600">Handling on-site resolution</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Active Departments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">ACTIVE DEPARTMENTS</div>
            <div className="text-3xl font-extrabold text-slate-900 my-1 tabular-nums">{activeDeptsCount}</div>
            <div className="text-[11px] text-slate-400">Surveillance, Security, Admin, HVAC</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Security & Admins */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">SECURITY & ADMINS</div>
            <div className="text-3xl font-extrabold text-slate-900 my-1 tabular-nums">{securityAdminsCount}</div>
            <div className="text-[11px] text-purple-600">Managing access & dispatch</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Search and Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, login email ID, or team..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-800"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_ADMIN">Super Administrator</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="OPERATOR">Operator</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Users Table (Matching Image 8 & 16) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">TECHNICIAN / MEMBER</th>
                <th className="py-3.5 px-4">DEPARTMENT / TEAM</th>
                <th className="py-3.5 px-4">ROLE</th>
                <th className="py-3.5 px-4">GRANULAR RIGHTS</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => {
                const rightsCount = user.granular_rights ? user.granular_rights.length : 2;

                const roleBadgeStyle = {
                  SUPER_ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
                  SUPERVISOR: 'bg-purple-50 text-purple-700 border-purple-200',
                  TECHNICIAN: 'bg-blue-50 text-blue-700 border-blue-200',
                  OPERATOR: 'bg-slate-100 text-slate-700 border-slate-200'
                }[user.role];

                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User Name & Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {user.avatar_initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-0.5">
                            <span>{user.email}</span>
                            <button
                              onClick={() => handleCopyEmail(user.email)}
                              title="Copy email address"
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {copiedEmail === user.email ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            🔒 Password Set
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Department / Team */}
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {user.department_name}
                    </td>

                    {/* Role Pill */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase ${roleBadgeStyle}`}>
                        {user.role === 'SUPER_ADMIN' ? 'Super Administrator' : user.role}
                      </span>
                    </td>

                    {/* Granular Rights */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-sm">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          🗝 {rightsCount} / 10 Rights
                        </span>
                        {user.granular_rights?.slice(0, 4).map(right => (
                          <span
                            key={right}
                            className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {right}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 text-slate-400">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          title="Edit User Profile & Rights"
                          className="hover:text-slate-900 p-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            const newPass = prompt(`Set new password for ${user.name}:`, 'Password123!');
                            if (newPass) onUpdateUser(user.id, { password_hash: newPass });
                          }}
                          title="Reset Password"
                          className="hover:text-amber-600 p-1"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Revoke access for user ${user.name}?`)) {
                              onUpdateUser(user.id, { status: user.status === 'Active' ? 'Blocked' : 'Active' });
                            }
                          }}
                          title="Toggle Access"
                          className="hover:text-orange-600 p-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Permanently delete user ${user.name}?`)) {
                              onDeleteUser(user.id);
                            }
                          }}
                          title="Delete User Record"
                          className="hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingUser ? 'Edit Member Profile & Rights' : 'Add Member / Technician'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Ali"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="technician@ideas.com.pk"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department *</label>
                  <select
                    value={departmentId}
                    onChange={e => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Role Tier *</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="TECHNICIAN">Technician</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="SUPER_ADMIN">Super Administrator</option>
                    <option value="OPERATOR">Operator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Password</label>
                <input
                  type="text"
                  placeholder="Password123!"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Granular Permissions & Rights</label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {allAvailableRights.map(right => {
                    const isChecked = selectedRights.includes(right);
                    return (
                      <label key={right} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedRights([...selectedRights, right]);
                            } else {
                              setSelectedRights(selectedRights.filter(r => r !== right));
                            }
                          }}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-slate-700">{right}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#0F2942] hover:bg-[#163859] rounded-lg shadow-2xs"
                >
                  {editingUser ? 'Save Changes' : 'Authorize Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
