import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import ProtectedRoute from './ProtectedRoutes';
import LoginPage from '../Pages/AuthPages/LoginPage';
import SignupPage from '../Pages/AuthPages/SignupPage';
import Chat from '../Pages/Chat';
import DataSource from '../Pages/DataSource';
import HomePage from '../Pages/GenericPages/HomePage';
import Notepad from '../Pages/notepad';

function AppRouter() {
    return (
      <Router>
        <Routes>
            <Route path="/app/login" element={<LoginPage />} />
            <Route path="/app/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route path="/app/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/app/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/app/dbsource" element={<ProtectedRoute><DataSource /></ProtectedRoute>} />     
            <Route path="/app/notepad" element={<ProtectedRoute><Notepad /></ProtectedRoute>} />            
        </Routes>
      </Router>
    );
}

export default AppRouter;
