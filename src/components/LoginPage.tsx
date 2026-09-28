import React, { useState } from 'react';
import {
  Video,
  Bell,
  ShieldCheck,
  Globe,
  ChevronDown,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle
} from 'lucide-react';
import { IdeasLogo } from './IdeasLogo';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: identifier.trim(),
          password
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success || !data.user) {
        setError(
          data?.error ||
          'Invalid username or password. Please try again.'
        );
        return;
      }

      onLoginSuccess(data.user);
    } catch {
      setError('Unable to connect to the authentication server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#050B14] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* =========================================================================
          LEFT SIDE: Dark Hero Banner with Surveillance Branding (Matching Image)
          ========================================================================= */}
      <div className="w-full lg:w-1/2 bg-[#050B14] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800/80">
        {/* Soft Background Ambient Radial Glow */}
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(89,184,40,0.12)_0%,rgba(16,40,65,0.2)_50%,transparent_75%)] pointer-events-none blur-2xl"></div>
        <div className="absolute -top-32 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(20,50,80,0.35)_0%,transparent_70%)] pointer-events-none blur-3xl"></div>

        {/* Top: Logo & Enterprise Portal Badge */}
        <div className="space-y-4 z-10">
          <div className="flex items-center gap-3">
            <IdeasLogo size="lg" glyphColor="#59B828" textColor="#59B828" />
          </div>

          <div>
            <span className="inline-block px-4 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 shadow-xs">
              ENTERPRISE PORTAL
            </span>
          </div>
        </div>

        {/* Center: Main Headline & 3 Key Features */}
        <div className="my-10 lg:my-16 max-w-lg space-y-8 z-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] text-white">
              Surveillance
              <span className="block text-[#59B828] mt-1">Operations</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-4 font-normal leading-relaxed">
              Monitor. Detect. Respond. Keep Your Environment Safe.
            </p>
          </div>

          {/* 3 Value Proposition Items with Rounded Green Boxes */}
          <div className="space-y-5 pt-2">
            {/* Feature 1 */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#092215] border border-[#164a2c] text-[#59B828] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-tight">Live Camera Monitoring</h3>
                <p className="text-slate-400 text-xs mt-0.5">Real-time feeds, 24/7</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#092215] border border-[#164a2c] text-[#59B828] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-tight">Instant Alerts</h3>
                <p className="text-slate-400 text-xs mt-0.5">Detect and respond faster</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-[#092215] border border-[#164a2c] text-[#59B828] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-tight">Enhanced Security</h3>
                <p className="text-slate-400 text-xs mt-0.5">Safer places, stronger operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Footer Line & Brand Motto */}
        <div className="z-10 pt-6">
          <div className="h-[2px] w-48 bg-gradient-to-r from-[#59B828] to-transparent mb-4"></div>
          <div className="text-[11px] font-mono font-medium tracking-[0.22em] text-slate-400 uppercase">
            IDEAS &nbsp;|&nbsp; TECHNOLOGY &nbsp;|&nbsp; A SAFER TOMORROW
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT SIDE: Pure White Login Form with Organic Mint Curves (Matching Image)
          ========================================================================= */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        {/* Soft Organic Pale Mint Shapes in Top-Right and Bottom-Right Background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EAF6E6] rounded-bl-[140px] pointer-events-none opacity-85 -z-0"></div>
        <div className="absolute -bottom-16 right-0 w-72 h-80 bg-[#EBF6E7] rounded-tl-[130px] pointer-events-none opacity-70 -z-0"></div>

        {/* Top Header: Language Selector */}
        <div className="flex items-center justify-end relative z-10">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{selectedLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs">
                {['English', 'Urdu (اردو)', 'Arabic (العربية)'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLang(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 transition-colors ${
                      selectedLang === lang ? 'text-emerald-700 font-bold bg-emerald-50/50' : 'text-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Centered Login Card */}
        <div className="my-auto max-w-[420px] w-full mx-auto z-10 py-6">
          {/* Logo on Right Form Side (Matching Image) */}
          <div className="mb-6">
            <IdeasLogo size="md" glyphColor="#59B828" textColor="#59B828" />
          </div>

          <div className="space-y-1 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Monitor. Detect. Respond. Keep Your Environment Safe.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Authentication failed</span>
                <p className="text-[11px] text-rose-700">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="Enter your username or email"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#59B828]/30 focus:border-[#59B828] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#59B828]/30 focus:border-[#59B828] font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Protected Session & Forgot Password Row */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px] sm:text-xs">Protected Session</span>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline text-[11px] sm:text-xs"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button (Matching Image) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-[#178338] hover:bg-[#13702f] active:bg-[#0f5c26] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-75 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Bottom Security Note */}
        <div className="text-center text-[11px] text-slate-400 z-10 pt-4">
          Authorized personnel only. All access attempts are recorded to the Hostinger MySQL compliance ledger.
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Credential Assistance</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                To reset or verify your Enterprise Surveillance Portal access credentials, please contact the Security Operations Administrator or email <strong className="text-slate-800">admin@ideas.com.pk</strong> with your employee ID.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
