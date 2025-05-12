import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";

const AuthenticationRoutes = () => {
    
return (
    <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
    </Routes>
    );
};

export default AuthenticationRoutes;