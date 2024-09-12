import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import ProtectedRoute from './ProtectedRoutes';
import LoginPage from '../Pages/AuthPages/LoginPage';
import SignupPage from '../Pages/AuthPages/SignupPage';
import Chat from '../Pages/Chat';
import DataSource from '../Pages/DataSource';
import HomePage from '../Pages/GenericPages/HomePage';
import NotePad from '../Pages/Note';

function AppRouter() {
    return (
      <Router>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/dbsource" element={<ProtectedRoute><DataSource /></ProtectedRoute>} />     
            <Route path="/notepad" element={<ProtectedRoute><NotePad /></ProtectedRoute>} />            
        </Routes>
      </Router>
    );
}

export default AppRouter;
