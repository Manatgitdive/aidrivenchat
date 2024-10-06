import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext';
import Dashboard from './components/Dashboard';
import Chat from './components/Chat';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import FounderProfile from './components/FounderProfile';

const App = () => {
  return (
    <SupabaseProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat/:founderId" element={<Chat />} />
          <Route path="/profile/:founderId" element={<FounderProfile />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
};

export default App;