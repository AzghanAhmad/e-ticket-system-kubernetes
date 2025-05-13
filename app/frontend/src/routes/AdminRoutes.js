import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";

// Import components
import AdminDashboard from "../components/Admin/Dashboard/AdminDashboard";
import AdminList from "../components/Admin/Account Management/AccountList";
import AddAdmin from "../components/Admin/Account Management/AddAccount";
import EditAdmin from "../components/Admin/Account Management/EditAccount";
import RouteList from "../components/Admin/Route Management/RouteList";
import AddRoute from "../components/Admin/Route Management/AddRoute";
import EditRoute from "../components/Admin/Route Management/EditRoute";
import ScheduleList from "../components/Admin/Schedules/ScheduleList";
import AddSchedule from "../components/Admin/Schedules/AddSchedule";
import EditSchedule from "../components/Admin/Schedules/EditSchedule";
import BusList from "../components/Admin/Bus Management/BusList";
import AddBus from "../components/Admin/Bus Management/AddBus";
import EditBus from "../components/Admin/Bus Management/EditBus";
import DriverList from "../components/Admin/Driver Management/DriverList";
import AddDriver from "../components/Admin/Driver Management/AddDriver";
import EditDriver from "../components/Admin/Driver Management/EditDriver";
import FareList from "../components/Admin/Fare Management/FareList";
import AddFare from "../components/Admin/Fare Management/AddFare";
import EditFare from "../components/Admin/Fare Management/EditFare";
import BookingManagement from "../components/Admin/Booking Management/BookingManagement";
import RefundManagement from "../components/Admin/Refund Management/RefundManagement";

const AdminRoutes = () => {

    const [admins, setAdmins] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [fares, setFares] = useState([]);

    // Fetch data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [adminRes, routeRes, scheduleRes, busRes, driverRes, fareRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/admins"),
                    axios.get("http://localhost:5000/api/routes"),
                    axios.get("http://localhost:5000/api/schedules"),
                    axios.get("http://localhost:5000/api/buses"),
                    axios.get("http://localhost:5000/api/drivers"),
                    axios.get("http://localhost:5000/api/fares"),
                ]);

                setAdmins(adminRes.data);
                setRoutes(routeRes.data);
                setSchedules(scheduleRes.data);
                setBuses(busRes.data);
                setDrivers(driverRes.data);
                setFares(fareRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle errors (e.g., redirect to login if unauthorized)
            }
        };

        fetchData();
    }, []);

    return (
        <Routes>

            {/* Admin Management */}
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/accounts" element={<AdminList admins={admins} setAdmins={setAdmins} />} />
            <Route path="/accounts/add" element={<AddAdmin admins={admins} setAdmins={setAdmins} />} />
            <Route path="/accounts/edit/:id" element={<EditAdmin admins={admins} setAdmins={setAdmins} />} />

            <Route path="/refunds" element={<RefundManagement />} />
            <Route path="/bookings" element={<BookingManagement />} />
            

            {/* Route Management */}
            <Route path="/routes" element={<RouteList routes={routes} setRoutes={setRoutes} />} />
            <Route path="/routes/add" element={<AddRoute routes={routes} setRoutes={setRoutes} />} />
            <Route path="/routes/edit/:id" element={<EditRoute routes={routes} setRoutes={setRoutes} />} />

            {/* Schedule Management */}
            <Route path="/schedules" element={<ScheduleList schedules={schedules} setSchedules={setSchedules} />} />
            <Route path="/schedules/add" element={<AddSchedule schedules={schedules} setSchedules={setSchedules} />} />
            <Route path="/schedules/edit/:id" element={<EditSchedule schedules={schedules} setSchedules={setSchedules} />} />

            {/* Bus Management */}
            <Route path="/buses" element={<BusList buses={buses} setBuses={setBuses} />} />
            <Route path="/buses/add" element={<AddBus buses={buses} setBuses={setBuses} />} />
            <Route path="/buses/edit/:id" element={<EditBus buses={buses} setBuses={setBuses} />} />

            {/* Driver Management */}
            <Route path="/drivers" element={<DriverList drivers={drivers} setDrivers={setDrivers} />} />
            <Route path="/drivers/add" element={<AddDriver drivers={drivers} setDrivers={setDrivers} />} />
            <Route path="/drivers/edit/:id" element={<EditDriver drivers={drivers} setDrivers={setDrivers} />} />

            {/* Fare Management */}
            <Route path="/fares" element={<FareList fares={fares} setFares={setFares} buses={buses} routes={routes} />} />
            <Route path="/fares/add" element={<AddFare fares={fares} setFares={setFares} buses={buses} routes={routes} />} />
            <Route path="/fares/edit/:id" element={<EditFare fares={fares} setFares={setFares} buses={buses} routes={routes} />} />
        </Routes>
    );
};

export default AdminRoutes;
