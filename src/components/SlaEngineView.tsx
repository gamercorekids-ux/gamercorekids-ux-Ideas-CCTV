import React, { useState } from 'react';
import { ShieldCheck, Sliders, Clock, AlertCircle, CheckCircle2, Bell, X } from 'lucide-react';
import { SlaRule } from '../types';

interface SlaEngineViewProps {
  rules: SlaRule[];
  onUpdateRule: (id: string, updates: Partial<SlaRule>) => void;
}

export const SlaEngineView: React.FC<SlaEngineViewProps> = ({ rules, onUpdateRule }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<SlaRule | null>(null);

  // Form states
  const [responseMinutes, setResponseMinutes] = useState(15);
  const [resolutionHours, setResolutionHours] = useState(2);
  const [escalationHours, setEscalationHours] = useState(1);

  const handleEditClick = (rule: SlaRule) => {
    setSelectedRule(rule);
    setResponseMinutes(rule.response_sla_minutes);
    setResolutionHours(rule.resolution_sla_hours);
    setEscalationHours(rule.escalation_trigger_hours);
    setShowEditModal(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRule) return;

    onUpdateRule(selectedRule.id, {
      response_sla_minutes: Number(responseMinutes),
      resolution_sla_hours: Number(resolutionHours),
      escalation_trigger_hours: Number(escalationHours)
    });

    setShowEditModal(false);
    setSelectedRule(null);
  };

  const formatHours = (hrs: number) => {
    return hrs >= 24 ? `${hrs} hours (${hrs / 24}d)` : `${hrs} hours`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Description and Configure Button (Matching Image 7) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Configurable SLA Engine & Escalation Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage automated SLA response deadlines, resolution thresholds, and multi-tier escalation policies.
            </p>
          </div>
        </div>

        <button
          onClick={() => handleEditClick(rules[0])}
          className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#0F2942] hover:bg-[#163859] text-white transition-colors flex items-center gap-2 shadow-2xs shrink-0 self-start md:self-auto"
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-400" />
          <span>Configure / Edit Rules</span>
        </button>
      </div>

      {/* 2. Active SLA Matrix Rules Table (Matching Image 7) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">Active SLA Matrix Rules</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tickets are automatically assigned response and resolution timers based on Priority and Category.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">PRIORITY TIER</th>
                <th className="py-3.5 px-5">CATEGORY / DOMAIN</th>
                <th className="py-3.5 px-5">DEPARTMENT</th>
                <th className="py-3.5 px-5">RESPONSE SLA</th>
                <th className="py-3.5 px-5">RESOLUTION SLA</th>
                <th className="py-3.5 px-5">ESCALATION TRIGGER</th>
                <th className="py-3.5 px-5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rules.map(rule => {
                const badgeStyle = {
                  CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
                  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
                  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
                  LOW: 'bg-slate-50 text-slate-700 border-slate-200'
                }[rule.priority_tier];

                return (
                  <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase ${badgeStyle}`}>
                        {rule.priority_tier}
                      </span>
                    </td>

                    <td className="py-4 px-5 font-semibold text-slate-800 whitespace-nowrap">
                      {rule.category_domain}
                    </td>

                    <td className="py-4 px-5 text-slate-600 whitespace-nowrap">
                      {rule.department}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-slate-700">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{rule.response_sla_minutes >= 60 ? `${rule.response_sla_minutes / 60} hours` : `${rule.response_sla_minutes} min`}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap">
                      {formatHours(rule.resolution_sla_hours)}
                    </td>

                    <td className="py-4 px-5 font-semibold text-amber-700 whitespace-nowrap">
                      {rule.escalation_trigger_hours} hour{rule.escalation_trigger_hours > 1 ? 's' : ''} remaining
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(rule)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Active</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Three Policy Explanation Cards (Matching Image 7) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Tier 1 Card: 80% SLA Threshold */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs flex items-center justify-center border border-amber-200">
            1
          </div>
          <h4 className="text-sm font-bold text-slate-900">80% SLA Threshold</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            When 80% of the resolution SLA time is consumed without technician acknowledgment or progress, the system automatically dispatches an urgent reminder notification to the assigned technician.
          </p>
        </div>

        {/* Tier 2 Card: 90% SLA At-Risk */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 font-bold text-xs flex items-center justify-center border border-orange-200">
            2
          </div>
          <h4 className="text-sm font-bold text-slate-900">90% SLA At-Risk</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upon reaching 90% SLA consumption, the ticket status changes to AT RISK, triggering an alert escalation notification to the department supervisor and manager.
          </p>
        </div>

        {/* Tier 3 Card: 100% SLA Breach */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center border border-rose-200">
            3
          </div>
          <h4 className="text-sm font-bold text-slate-900">100% SLA Breach</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            If the resolution timer expires (100%), the SLA is officially BREACHED. The ticket is immediately flagged red, escalated to Super Admin, and logged in compliance audit records.
          </p>
        </div>
      </div>

      {/* Edit Rule Modal */}
      {showEditModal && selectedRule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit SLA Policy Tier</h3>
                <div className="text-xs text-slate-500 font-medium">{selectedRule.priority_tier} · {selectedRule.category_domain}</div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Response SLA (Minutes)</label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={responseMinutes}
                  onChange={e => setResponseMinutes(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Resolution SLA (Hours)</label>
                <input
                  type="number"
                  min="1"
                  max="240"
                  value={resolutionHours}
                  onChange={e => setResolutionHours(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Escalation Trigger Threshold (Hours Remaining)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={escalationHours}
                  onChange={e => setEscalationHours(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#0F2942] hover:bg-[#163859] rounded-lg shadow-2xs"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
