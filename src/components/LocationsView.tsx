import React, { useState } from 'react';
import {
  Building2,
  Plus,
  FileDown,
  RotateCw,
  Search,
  MapPin,
  Mail,
  Phone,
  Edit2,
  Trash2,
  EyeOff,
  Eye,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { Location, Region } from '../types';

interface LocationsViewProps {
  locations: Location[];
  regions: Region[];
  onAddBranch: (data: Partial<Location>) => void;
  onUpdateBranch: (id: string, data: Partial<Location>) => void;
  onDeleteBranch: (id: string) => void;
  onCreateRegion: (name: string, code: string) => void;
  onDeleteRegion: (id: string) => void;
  onSyncData: () => void;
}

export const LocationsView: React.FC<LocationsViewProps> = ({
  locations,
  regions,
  onAddBranch,
  onUpdateBranch,
  onDeleteBranch,
  onCreateRegion,
  onDeleteRegion,
  onSyncData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateRegionModal, setShowCreateRegionModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // Form states
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [regionId, setRegionId] = useState(regions[0]?.id || 'reg_central');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cameraZones, setCameraZones] = useState(1);
  const [areasDetails, setAreasDetails] = useState('Main Showroom');

  // New Region form
  const [newRegionName, setNewRegionName] = useState('');
  const [newRegionCode, setNewRegionCode] = useState('');

  const filteredLocations = locations.filter(loc => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        loc.name.toLowerCase().includes(q) ||
        loc.branch_code.toLowerCase().includes(q) ||
        loc.physical_address.toLowerCase().includes(q) ||
        loc.contact_person.toLowerCase().includes(q) ||
        loc.phone.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedRegionFilter !== 'ALL' && loc.region_id !== selectedRegionFilter && loc.region_name !== selectedRegionFilter) {
      return false;
    }
    if (selectedStatusFilter !== 'ALL' && loc.status !== selectedStatusFilter) {
      return false;
    }
    return true;
  });

  const handleOpenEdit = (loc: Location) => {
    setEditingLocation(loc);
    setBranchName(loc.name);
    setBranchCode(loc.branch_code);
    setRegionId(loc.region_id);
    setAddress(loc.physical_address);
    setContactPerson(loc.contact_person);
    setPhone(loc.phone);
    setEmail(loc.notification_email);
    setCameraZones(loc.camera_zones);
    setAreasDetails(loc.areas_details);
    setShowAddModal(true);
  };

  const handleSubmitLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const selRegion = regions.find(r => r.id === regionId);
    const payload: Partial<Location> = {
      name: branchName,
      branch_code: branchCode,
      region_id: regionId,
      region_name: selRegion ? selRegion.name.replace(' Region', '') : 'Central',
      physical_address: address || 'Address not configured',
      contact_person: contactPerson,
      phone,
      notification_email: email,
      camera_zones: Number(cameraZones),
      areas_details: areasDetails,
      status: 'Active'
    };

    if (editingLocation) {
      onUpdateBranch(editingLocation.id, payload);
    } else {
      onAddBranch(payload);
    }

    setShowAddModal(false);
    setEditingLocation(null);
  };

  const handleCreateRegionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegionName) return;
    onCreateRegion(newRegionName, newRegionCode || newRegionName.substring(0, 4).toUpperCase());
    setShowCreateRegionModal(false);
    setNewRegionName('');
    setNewRegionCode('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header (Matching Image 5) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            <span>🌐 MASTER DATA MODULE</span>
            <span>•</span>
            <span>LOCATIONS → REGIONS → BRANCHES</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Locations & Region Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Centralized master data repository for Regions, Store Profiles, Physical Addresses, and Branch Contact Info.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onSyncData}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>SYNC TICKETS DATA</span>
          </button>

          <button
            onClick={() => {
              window.open('/api/database/export?target=locations&format=csv', '_blank');
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingLocation(null);
              setBranchName('');
              setBranchCode(`ST${Math.floor(100 + Math.random() * 900)}`);
              setAddress('');
              setContactPerson('');
              setPhone('');
              setEmail('');
              setShowAddModal(true);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>ADD NEW BRANCH PROFILE</span>
          </button>
        </div>
      </div>

      {/* Region Management Grid Cards (Matching Image 5) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">REGION MANAGEMENT</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Global regions configured across the surveillance network
            </span>
          </div>
          <button
            onClick={() => setShowCreateRegionModal(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Region</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {regions.map(region => {
            const count = locations.filter(
              l => l.region_id === region.id || l.region_name.toLowerCase().includes(region.name.toLowerCase().replace(' region', ''))
            ).length;

            return (
              <div key={region.id} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">{region.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">{count} branches assigned</div>
                </div>

                <div className="flex items-center gap-3 pt-3 mt-2 border-t border-slate-200/60 text-[11px]">
                  <button
                    onClick={() => {
                      const newName = prompt('Update region name:', region.name);
                      if (newName) onCreateRegion(newName, region.code);
                    }}
                    className="text-slate-500 hover:text-slate-900 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete region ${region.name}?`)) onDeleteRegion(region.id);
                    }}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              SEARCH LOCATIONS, BRANCH ID OR CONTACTS
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Store Name, Branch ID, Address, Contact Person, Phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-800"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              REGION FILTER
            </label>
            <select
              value={selectedRegionFilter}
              onChange={e => setSelectedRegionFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="ALL">All regions ({locations.length})</option>
              {regions.map(r => (
                <option key={r.id} value={r.name.replace(' Region', '')}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              STATUS FILTER
            </label>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Locations Table (Matching Image 5) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">STORE NAME & BRANCH ID</th>
                <th className="py-3.5 px-4">REGION</th>
                <th className="py-3.5 px-4">PHYSICAL ADDRESS</th>
                <th className="py-3.5 px-4">CONTACT PERSON & PHONE</th>
                <th className="py-3.5 px-4">AREAS & DETAILS</th>
                <th className="py-3.5 px-4">NOTIFICATION EMAIL</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocations.slice(0, 50).map(loc => (
                <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Store Name & ID */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{loc.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">ID: {loc.branch_code}</div>
                      </div>
                    </div>
                  </td>

                  {/* Region */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {loc.region_name}
                    </span>
                  </td>

                  {/* Physical Address */}
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{loc.physical_address}</span>
                    </div>
                  </td>

                  {/* Contact Person & Phone */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="text-slate-900 font-medium">{loc.contact_person || 'No contact details'}</div>
                    {loc.phone && <div className="text-[10px] font-mono text-slate-400">{loc.phone}</div>}
                  </td>

                  {/* Areas & Details */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                        {loc.areas_details || 'Main Showroom'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {loc.camera_zones} zone{loc.camera_zones > 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>

                  {/* Notification Email */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="font-mono text-[11px] truncate max-w-[180px]">{loc.notification_email}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => handleOpenEdit(loc)}
                        title="Edit Branch Profile"
                        className="hover:text-slate-900 p-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          const nextStatus = loc.status === 'Active' ? 'Maintenance' : 'Active';
                          onUpdateBranch(loc.id, { status: nextStatus });
                        }}
                        title="Toggle Operational Status"
                        className="hover:text-amber-600 p-1"
                      >
                        {loc.status === 'Active' ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove location ${loc.name}?`)) onDeleteBranch(loc.id);
                        }}
                        title="Remove Location"
                        className="hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Branch Profile Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingLocation ? 'Edit Branch Profile' : 'Add New Branch Profile'}
            </h3>

            <form onSubmit={handleSubmitLocation} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Branch Code *</label>
                  <input
                    type="text"
                    required
                    value={branchCode}
                    onChange={e => setBranchCode(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Region *</label>
                  <select
                    value={regionId}
                    onChange={e => setRegionId(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  >
                    {regions.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Store / Branch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Agency Jaranwala"
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Physical Address</label>
                <input
                  type="text"
                  placeholder="Circular Road, Near City Chowk..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Muhammad Tariq"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Notification Email</label>
                  <input
                    type="email"
                    placeholder="branch@ideas.com.pk"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Camera Zones</label>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={cameraZones}
                    onChange={e => setCameraZones(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163859] rounded-lg shadow-2xs"
                >
                  {editingLocation ? 'Update Profile' : 'Save Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Region Modal */}
      {showCreateRegionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Create New Operational Region</h3>
            <form onSubmit={handleCreateRegionSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Region Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Region"
                  value={newRegionName}
                  onChange={e => setNewRegionName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Region Code</label>
                <input
                  type="text"
                  placeholder="WEST"
                  value={newRegionCode}
                  onChange={e => setNewRegionCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none font-mono"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateRegionModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2942] hover:bg-[#163859] rounded-lg shadow-2xs"
                >
                  Create Region
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
