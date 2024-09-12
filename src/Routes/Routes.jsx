import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import ProtectedRoute from './ProtectedRoutes.jsx';
import LoginPage from '../Pages/AuthPages/LoginPage.jsx';
import SignupPage from '../Pages/AuthPages/SignupPage.jsx';
import Chat from '../Pages/Chat.jsx';
import DataSource from '../Pages/DataSource.jsx';
import HomePage from '../Pages/GenericPages/HomePage.jsx';
import NotePad from '../Pages/Note.jsx';

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
