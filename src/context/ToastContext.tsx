import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  UserCheck,
  Tag,
  ArrowRight,
  X,
  BellRing
} from 'lucide-react';
import { Ticket, User } from '../types';

export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'assignment' | 'status_change';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  ticketId?: string;
  ticketNumber?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  createdAt: number;
}

export interface ToastOptions {
  type?: ToastType;
  title: string;
  message: string;
  ticketId?: string;
  ticketNumber?: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (options: ToastOptions) => string;
  dismissToast: (id: string) => void;
  notifyTicketAssigned: (ticket: Ticket, assigneeName?: string, onSelectTicket?: (ticket: Ticket) => void) => void;
  notifyTicketStatusChanged: (ticket: Ticket, oldStatus: string, newStatus: string, onSelectTicket?: (ticket: Ticket) => void) => void;
  notifyUserStatusChanged: (user: User, statusType: 'status' | 'workload', oldValue: string, newValue: string) => void;
  notifySuccess: (title: string, message?: string) => void;
  notifyInfo: (title: string, message?: string) => void;
  notifyWarning: (title: string, message?: string) => void;
  notifyError: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const dismissToast = useCallback((id: string) => {
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({
      type = 'info',
      title,
      message,
      ticketId,
      ticketNumber,
      actionLabel,
      onAction,
      duration = 6000
    }: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = {
        id,
        type,
        title,
        message,
        ticketId,
        ticketNumber,
        actionLabel,
        onAction,
        duration,
        createdAt: Date.now()
      };

      setToasts(prev => [newToast, ...prev.slice(0, 4)]); // Keep max 5 visible toasts

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => {
          dismissToast(id);
        }, duration);
      }

      return id;
    },
    [dismissToast]
  );

  const notifyTicketAssigned = useCallback(
    (ticket: Ticket, assigneeName?: string, onSelectTicket?: (ticket: Ticket) => void) => {
      const name = assigneeName || ticket.assigned_technician_name || 'You';
      addToast({
        type: 'assignment',
        title: `Ticket Assigned: ${ticket.ticket_number}`,
        message: `${ticket.subject} has been assigned to ${name}. Location: ${ticket.location_name || ticket.region_name || 'Assigned Site'}.`,
        ticketId: ticket.id,
        ticketNumber: ticket.ticket_number,
        actionLabel: onSelectTicket ? 'View Ticket' : undefined,
        onAction: onSelectTicket ? () => onSelectTicket(ticket) : undefined,
        duration: 7000
      });
    },
    [addToast]
  );

  const notifyTicketStatusChanged = useCallback(
    (ticket: Ticket, oldStatus: string, newStatus: string, onSelectTicket?: (ticket: Ticket) => void) => {
      const isResolved = newStatus === 'RESOLVED' || newStatus === 'CLOSED';
      addToast({
        type: isResolved ? 'success' : 'status_change',
        title: `Status Changed: ${ticket.ticket_number}`,
        message: `Ticket moved from ${oldStatus} ➔ ${newStatus} (${ticket.subject})`,
        ticketId: ticket.id,
        ticketNumber: ticket.ticket_number,
        actionLabel: onSelectTicket ? 'View Ticket' : undefined,
        onAction: onSelectTicket ? () => onSelectTicket(ticket) : undefined,
        duration: 6000
      });
    },
    [addToast]
  );

  const notifyUserStatusChanged = useCallback(
    (user: User, statusType: 'status' | 'workload', oldValue: string, newValue: string) => {
      const label = statusType === 'workload' ? 'Workload Status' : 'Account Status';
      addToast({
        type: 'status_change',
        title: `${label} Updated`,
        message: `${user.name}'s ${label.toLowerCase()} is now "${newValue}" (was "${oldValue}").`,
        duration: 5000
      });
    },
    [addToast]
  );

  const notifySuccess = useCallback(
    (title: string, message = '') => {
      addToast({ type: 'success', title, message, duration: 4500 });
    },
    [addToast]
  );

  const notifyInfo = useCallback(
    (title: string, message = '') => {
      addToast({ type: 'info', title, message, duration: 4500 });
    },
    [addToast]
  );

  const notifyWarning = useCallback(
    (title: string, message = '') => {
      addToast({ type: 'warning', title, message, duration: 6000 });
    },
    [addToast]
  );

  const notifyError = useCallback(
    (title: string, message = '') => {
      addToast({ type: 'error', title, message, duration: 7000 });
    },
    [addToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        dismissToast,
        notifyTicketAssigned,
        notifyTicketStatusChanged,
        notifyUserStatusChanged,
        notifySuccess,
        notifyInfo,
        notifyWarning,
        notifyError
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component
interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map(toast => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
};

// Individual Toast Card
const ToastCard: React.FC<{ toast: ToastItem; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const getIconAndColors = () => {
    switch (toast.type) {
      case 'assignment':
        return {
          icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
          borderColor: 'border-emerald-300',
          accentBg: 'bg-emerald-50 text-emerald-800',
          indicator: 'bg-emerald-500',
          badgeText: 'Assignment'
        };
      case 'status_change':
        return {
          icon: <Tag className="w-5 h-5 text-blue-600" />,
          borderColor: 'border-blue-300',
          accentBg: 'bg-blue-50 text-blue-800',
          indicator: 'bg-blue-500',
          badgeText: 'Status Update'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          borderColor: 'border-emerald-300',
          accentBg: 'bg-emerald-50 text-emerald-800',
          indicator: 'bg-emerald-500',
          badgeText: 'Success'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          borderColor: 'border-amber-300',
          accentBg: 'bg-amber-50 text-amber-800',
          indicator: 'bg-amber-500',
          badgeText: 'Attention'
        };
      case 'error':
        return {
          icon: <XCircle className="w-5 h-5 text-rose-600" />,
          borderColor: 'border-rose-300',
          accentBg: 'bg-rose-50 text-rose-800',
          indicator: 'bg-rose-500',
          badgeText: 'Error'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-slate-600" />,
          borderColor: 'border-slate-300',
          accentBg: 'bg-slate-50 text-slate-800',
          indicator: 'bg-slate-500',
          badgeText: 'Notification'
        };
    }
  };

  const style = getIconAndColors();

  return (
    <div
      className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-xl shadow-xl border ${style.borderColor} p-3.5 sm:p-4 text-slate-800 transition-all transform translate-y-0 opacity-100 duration-200 hover:shadow-2xl relative overflow-hidden`}
    >
      {/* Top Accent Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${style.indicator}`}></div>

      <div className="flex items-start gap-3">
        <div className="shrink-0 p-1.5 rounded-lg bg-slate-50 border border-slate-100 mt-0.5">
          {style.icon}
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.accentBg}`}>
              {style.badgeText}
            </span>
            <span className="text-xs font-bold text-slate-900 truncate">
              {toast.title}
            </span>
          </div>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
            {toast.message}
          </p>

          {/* Optional Action Button (e.g. View Ticket) */}
          {toast.onAction && toast.actionLabel && (
            <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  onDismiss();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                <span>{toast.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
