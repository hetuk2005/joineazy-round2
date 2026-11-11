import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { ResetModal } from './components/common/ResetModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentCoursePage } from './components/student/StudentCoursePage';
import { ProfessorDashboard } from './components/professor/ProfessorDashboard';
import { ProfessorCoursePage } from './components/professor/ProfessorCoursePage';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isResetOpen, setIsResetOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar onOpenResetModal={() => setIsResetOpen(true)} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 py-5 px-4 bg-white/40 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>
            <strong className="text-slate-700 dark:text-slate-200">Joineazy Round 2</strong> &bull; Student, Group &amp; Assignment Management
          </span>
          <span>
            Built by <strong className="text-slate-700 dark:text-slate-200">Hetuk Patel</strong>
          </span>
        </div>
      </footer>
      {isResetOpen && <ResetModal onClose={() => setIsResetOpen(false)} />}
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:courseId"
          element={
            <ProtectedRoute allowedRole="student">
              <DashboardLayout>
                <StudentCoursePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Professor Routes */}
        <Route
          path="/professor"
          element={
            <ProtectedRoute allowedRole="professor">
              <DashboardLayout>
                <ProfessorDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/courses/:courseId"
          element={
            <ProtectedRoute allowedRole="professor">
              <DashboardLayout>
                <ProfessorCoursePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
