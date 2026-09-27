import React, { useState } from 'react';
import { Shield, Copy, Check, X } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditDeepDiveModalProps {
  log: AuditLog | null;
  onClose: () => void;
}

export const AuditDeepDiveModal: React.FC<AuditDeepDiveModalProps> = ({ log, onClose }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!log) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(log.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(log.raw_json || log, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const formattedDate = new Date(log.timestamp).toLocaleString();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header (Matching Image 10) */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Audit Record Deep-Dive</h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 font-mono">
                <span>ID: {log.id}</span>
                <button
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-slate-700 p-0.5"
                  title="Copy log ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <span>•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ● Verified Immutable
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Metadata Cards Grid (Matching Image 10) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Date & Time */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">DATE & TIME</div>
            <div className="text-xs font-bold text-slate-900 mt-1">{formattedDate}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">{log.timestamp}</div>
          </div>

          {/* Card 2: Administrator */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">ADMINISTRATOR</div>
            <div className="text-xs font-bold text-slate-900 mt-1">{log.administrator}</div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">UID: {log.user_id}</div>
          </div>

          {/* Card 3: Target Setting / Entity */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">TARGET SETTING / ENTITY</div>
            <div className="text-xs font-mono font-semibold text-slate-800 mt-1 truncate">
              {log.target_entity}
            </div>
          </div>

          {/* Card 4: Action Code */}
          <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl">
            <div className="text-[10px] font-bold uppercase text-slate-400">ACTION CODE</div>
            <div className="mt-1">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {log.action_code}
              </span>
            </div>
          </div>
        </div>

        {/* Action Narrative Container */}
        <div>
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            ACTION NARRATIVE
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
            {log.action_narrative}
          </div>
        </div>

        {/* State Diff (Before & After) Container (Matching Image 10) */}
        <div>
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
            STATE DIFF (BEFORE & AFTER)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Previous Value */}
            <div className="p-4 bg-rose-50/30 border border-rose-200 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-rose-700 uppercase">PREVIOUS VALUE</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-rose-100 text-rose-800">
                  Before Change
                </span>
              </div>
              <div className="text-xs font-mono text-slate-600 italic">
                {log.previous_value || '— No previous value recorded / Newly initialized —'}
              </div>
            </div>

            {/* New Value */}
            <div className="p-4 bg-emerald-50/30 border border-emerald-200 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">NEW VALUE</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-100 text-emerald-800">
                  After Change
                </span>
              </div>
              <div className="text-xs font-mono text-emerald-900 font-medium">
                {log.new_value || 'Applied successfully'}
              </div>
            </div>
          </div>
        </div>

        {/* Complete Audit Record JSON Inspector (Matching Image 10) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              COMPLETE AUDIT RECORD (JSON)
            </span>
            <button
              onClick={handleCopyJson}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy JSON</span>
            </button>
          </div>

          <div className="bg-[#09151F] text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800 max-h-48">
            <pre>{JSON.stringify(log.raw_json || log, null, 2)}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="text-slate-400 font-mono text-[11px]">
            Compliance Protocol: Hostinger MySQL & Security Audit Trail
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 font-semibold text-white bg-[#0F2942] hover:bg-[#163859] rounded-xl shadow-2xs self-end sm:self-auto"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
