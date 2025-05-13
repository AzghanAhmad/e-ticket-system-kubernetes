import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";
import ErrorPage from "../components/ErrorPage";
import AdminRoutes from "./AdminRoutes";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="*" element={<ErrorPage />} />
    <Route path="/admin/*" element={<AdminRoutes />} />




  </Routes>
);

export default AppRoutes;
