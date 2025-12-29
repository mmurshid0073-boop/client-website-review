import React from 'react';
import { Helmet } from 'react-helmet';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <>
      <Helmet>
        <title>CRM Dashboard - Manage Your Business Efficiently</title>
        <meta name="description" content="Professional CRM application for managing clients, leads, and team members with powerful analytics and insights." />
      </Helmet>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;