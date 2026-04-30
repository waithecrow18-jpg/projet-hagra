import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import StudentPortal from './pages/StudentPortal';
import ManagerDashboard from './pages/ManagerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import OtpVerification from './pages/OtpVerification';

// Route guard for students
const StudentRoute = ({ children }) => {
  const { currentUser, getSiteStatus } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'superadmin') return <Navigate to="/admin" replace />;
  if (currentUser.role === 'manager') return <Navigate to="/manager" replace />;
  if (!currentUser.isVerified) return <Navigate to="/verify-otp" replace />;
  if (getSiteStatus() === 'closed') {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Inter, sans-serif' }}>
        <h1 style={{ color: '#ef4444' }}>Inscriptions Suspendues</h1>
        <p>Les inscriptions sont actuellement fermées par l'administration.</p>
        <button onClick={() => { localStorage.removeItem('session'); window.location.href='/'; }} 
          style={{ padding: '10px 20px', marginTop: 20, cursor: 'pointer' }}>Retour</button>
      </div>
    );
  }
  return children;
};

// Route guard for managers
const ManagerRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role === 'superadmin') return <Navigate to="/admin" replace />;
  if (currentUser.role === 'student') return <Navigate to="/portal" replace />;
  return children;
};

// Route guard for super admin
const SuperAdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'superadmin') return <Navigate to="/" replace />;
  return children;
};

// Redirect logged-in users away from login/register
const AuthRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser?.role === 'superadmin') return <Navigate to="/admin" replace />;
  if (currentUser?.role === 'manager') return <Navigate to="/manager" replace />;
  if (currentUser?.role === 'student') {
    if (!currentUser.isVerified) return <Navigate to="/verify-otp" replace />;
    return <Navigate to="/portal" replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
    <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
    <Route path="/verify-otp" element={<OtpVerification />} />
    <Route path="/portal" element={<StudentRoute><StudentPortal /></StudentRoute>} />
    <Route path="/manager" element={<ManagerRoute><ManagerDashboard /></ManagerRoute>} />
    <Route path="/admin" element={<SuperAdminRoute><SuperAdminDashboard /></SuperAdminRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <LanguageProvider>
        <AppRoutes />
      </LanguageProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
