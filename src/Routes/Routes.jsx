import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import ProtectedRoute from './ProtectedRoutes';
import LoginPage from '../Pages/Auth Pages/LoginPage';
import SignupPage from '../Pages/Auth Pages/SignupPage';
import Chat from '../Pages/Chat';
import DataSource from '../Pages/DataSource';
import HomePage from '../Pages/Generic Pages/HomePage';
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
