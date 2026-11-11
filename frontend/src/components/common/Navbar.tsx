import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sun,
  Moon,
  RotateCcw,
  LogOut,
  ShieldCheck,
  BookOpen,
  KeyRound,
} from 'lucide-react';

interface NavbarProps {
  onOpenResetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResetModal }) => {
  const { currentUser, logout, isDarkMode, toggleTheme } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homePath = currentUser?.role === 'professor' ? '/professor' : '/student';

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <Link to={homePath} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/25 text-white group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Joineazy
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
                  Round 2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                Course, Group &amp; Assignment Hub
              </p>
            </div>
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {currentUser && (
              <span
                title="Authenticated with simulated JWT stored in localStorage"
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60"
              >
                <KeyRound className="w-3 h-3" />
                JWT Session
              </span>
            )}

            <button
              type="button"
              onClick={onOpenResetModal}
              title="Reset demo data"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {currentUser && (
              <>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

                <div className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-500/25"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight max-w-[130px] truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] font-semibold flex items-center gap-1 leading-tight">
                      {currentUser.role === 'professor' ? (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Professor
                        </span>
                      ) : (
                        <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                          <BookOpen className="w-3 h-3" /> Student
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
