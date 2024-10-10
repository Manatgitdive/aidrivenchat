import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseProvider, useSupabase } from './contexts/SupabaseContext';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import './index.css';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabase();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });
  }, [supabase]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/chat/:founderId" element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
};

export default App;