import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import ProtectedRoute from './ProtectedRoutes';
import LoginPage from '../Pages/Auth Pages/LoginPage';
import SignupPage from '../Pages/Auth Pages/SignupPage';
import Chat from '../Pages/Chat';
import DataSource from '../Pages/DataSource';

function AppRouter() {
    return (
      <Router>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/data-source" element={<ProtectedRoute><DataSource /></ProtectedRoute>} />            
        </Routes>
      </Router>
    );
}

export default AppRouter;
