import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import FounderProfile from './components/FounderProfile';
import Chat from './components/Chat';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile/:founderId" 
            element={
              <PrivateRoute>
                <FounderProfile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/chat/:founderId" 
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
}

export default App;