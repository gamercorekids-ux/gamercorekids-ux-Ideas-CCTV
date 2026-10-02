import React, { FormEvent, useState } from 'react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setError('');
    setSubmitting(true);

    try {
      await onLogin(email.trim(), password);
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09151F] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#09151F] px-8 py-7">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                <div className="w-5 h-5 bg-emerald-400 rounded-md" />
              </div>

              <div>
                <div className="font-mono text-sm font-bold tracking-widest text-emerald-400">
                  OPSDESK
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Security Operations & Surveillance
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <h1 className="text-xl font-bold text-slate-900">
              Sign in
            </h1>

            <p className="text-sm text-slate-500 mt-1 mb-6">
              Enter your OpsDesk account credentials.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  placeholder="name@ideas.com.pk"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="px-3.5 py-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center text-[11px] text-slate-500 mt-4">
          Authorized users only
        </div>
      </div>
    </div>
  );
};
