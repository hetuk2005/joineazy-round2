import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const { currentUser, jwtToken, login, register, loginAsDemo, users, isDarkMode, toggleTheme } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);

  // If already logged in, send straight to role dashboard
  if (currentUser && jwtToken) {
    return <Navigate to={currentUser.role === 'professor' ? '/professor' : '/student'} replace />;
  }

  const switchMode = (nextMode: 'login' | 'register') => {
    setMode(nextMode);
    setFieldErrors({});
    setFormError(null);
  };

  const validate = () => {
    const errs: typeof fieldErrors = {};
    if (mode === 'register' && name.trim().length < 2) {
      errs.name = 'Full name must be at least 2 characters.';
    }
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    if (mode === 'login') {
      const res = login(email, password);
      if (!res.success) {
        setFormError(res.error || 'Authentication failed.');
        return;
      }
      navigate(res.user?.role === 'professor' ? '/professor' : '/student');
    } else {
      const res = register({ name, email, password, role });
      if (!res.success) {
        setFormError(res.error || 'Registration failed.');
        return;
      }
      navigate(res.user?.role === 'professor' ? '/professor' : '/student');
    }
  };

  const handleDemoLogin = (userId: string) => {
    const user = loginAsDemo(userId);
    if (user) {
      navigate(user.role === 'professor' ? '/professor' : '/student');
    }
  };

  const demoProfessors = users.filter((u) => u.role === 'professor').slice(0, 2);
  const demoStudents = users.filter((u) => u.role === 'student').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden transition-colors">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/25 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Joineazy
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Round 2 &bull; Academic Workflow Portal
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Auth Form Card */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              {mode === 'login' ? 'Sign in to your portal' : 'Register a new account'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'login'
                ? 'Access your courses, groups, and assignment submissions securely.'
                : 'Choose your role to unlock your tailored Student or Professor workspace.'}
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {mode === 'register' && (
              <>
                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                        role === 'student'
                          ? 'bg-brand-50/80 dark:bg-brand-950/50 border-brand-500 text-brand-700 dark:text-brand-300 ring-1 ring-brand-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <BookOpen className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Student</p>
                        <p className="text-[10px] opacity-80">Courses &amp; Groups</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('professor')}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                        role === 'professor'
                          ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/30'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold">Professor</p>
                        <p className="text-[10px] opacity-80">Manage &amp; Track</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="auth-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Hetuk Patel"
                      className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 ${
                        fieldErrors.name ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.name}</p>
                  )}
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                University Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@joineazy.edu"
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 ${
                    fieldErrors.email ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-100 ${
                    fieldErrors.password ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-rose-500 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition"
            >
              <span>{mode === 'login' ? 'Sign In' : `Register as ${role === 'professor' ? 'Professor' : 'Student'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Quick Demo Access */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-indigo-200 border border-white/15 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>1-Click Evaluator Demo Access</span>
            </div>
            <h2 className="text-lg font-extrabold">Test Both Roles Instantly</h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Click any seeded account below to generate a JWT session token in{' '}
              <code className="px-1 py-0.5 bg-white/10 rounded text-indigo-200">localStorage</code>, or type their email with password{' '}
              <code className="px-1.5 py-0.5 bg-white/10 rounded text-emerald-300 font-bold">Password@123</code>.
            </p>

            {/* Professors */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Professors
              </p>
              <div className="space-y-2">
                {demoProfessors.map((prof) => (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => handleDemoLogin(prof.id)}
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={prof.avatar} alt={prof.name} className="w-9 h-9 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{prof.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{prof.email}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                      Login &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Students */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Students
              </p>
              <div className="space-y-2">
                {demoStudents.map((stu, idx) => (
                  <button
                    key={stu.id}
                    type="button"
                    onClick={() => handleDemoLogin(stu.id)}
                    className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={stu.avatar} alt={stu.name} className="w-9 h-9 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">
                          {stu.name}
                          {idx === 0 && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-brand-500/30 text-brand-200">
                              Recommended
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {stu.email}
                          {idx === 0 && ' • Leader (CS-401), Member (CS-415), No Group (SE-302)'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-300 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                      Login &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 dark:text-slate-400 relative z-10">
        Joineazy Frontend Intern Round 2 &bull; Built by <strong>Hetuk Patel</strong>
      </footer>
    </div>
  );
};
