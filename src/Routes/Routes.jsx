import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from "../Pages/Auth Pages/LoginPage";
import SignupPage from "../Pages/Auth Pages/SignupPage";
import HomePage from '../Pages/Generic Pages/HomePage';

function AppRouter(){
    return(
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/home" element={<HomePage/>} />
            </Routes>
        </Router>
    )
}

export default AppRouter;