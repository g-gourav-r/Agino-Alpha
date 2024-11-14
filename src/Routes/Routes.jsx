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
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/dbsource" element={<DataSource />} />     
            <Route path="/notepad" element={<NotePad />} />            
        </Routes>
      </Router>
    );
}

export default AppRouter;
