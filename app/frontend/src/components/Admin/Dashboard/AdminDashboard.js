import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaBus, FaRoute, FaUserTie, FaRegMoneyBillAlt, FaUsers, FaUserShield } from "react-icons/fa";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalBuses: 0,
        busesOnRoute: 0,
        totalDrivers: 0,
        pendingRefunds: 0,
        totalAdmins: 0,
        totalUsers: 0,
    });

    useEffect(() => {
        // Fetch statistics from your API or backend
        const fetchStats = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/stats", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <h1 className="stats-title">Stats Corner</h1>
            {/* Statistics Overview Section with Animation */}
            <motion.div
                className="stats-overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="stat-card buses"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaBus className="stat-icon" />
                    <h2>Total Buses</h2>
                    <p>{stats.totalBuses}</p>
                </motion.div>

                <motion.div
                    className="stat-card buses-on-route"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaRoute className="stat-icon" />
                    <h2>Buses on Route</h2>
                    <p>{stats.busesOnRoute}</p>
                </motion.div>

                <motion.div
                    className="stat-card drivers"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaUserTie className="stat-icon" />
                    <h2>Total Drivers</h2>
                    <p>{stats.totalDrivers}</p>
                </motion.div>

                <motion.div
                    className="stat-card refunds"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaRegMoneyBillAlt className="stat-icon" />
                    <h2>Pending Refunds</h2>
                    <p>{stats.pendingRefunds}</p>
                </motion.div>

                <motion.div
                    className="stat-card admins"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaUserShield className="stat-icon" />
                    <h2>Total Admins</h2>
                    <p>{stats.totalAdmins}</p>
                </motion.div>

                <motion.div
                    className="stat-card users"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    <FaUsers className="stat-icon" />
                    <h2>Total Registered Users</h2>
                    <p>{stats.totalUsers}</p>
                </motion.div>
            </motion.div>

            {/* Background Image Section */}
            <div className="home-header"></div>
            <h1 className="dashboard-title">Admin Features</h1>
            <motion.div
                className="admin-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="dashboard-cards">
                    {/* Admin Accounts Card */}
                    <motion.div
                        className="dashboard-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Manage Accounts</h2>
                        <p>Manage admin accounts efficiently.</p>
                        <div className="dashboard-buttons">
                            <Link to="/admin/accounts" className="dashboard-button">
                                View Admin Accounts
                            </Link>
                            <Link to="/admin/accounts/add" className="dashboard-button">
                                Add New Admin
                            </Link>
                        </div>
                    </motion.div>

                    {/* Routes Card */}
                    <motion.div
                        className="dashboard-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Routes</h2>
                        <p>View and edit bus routes.</p>
                        <div className="dashboard-buttons">
                            <Link to="/admin/routes" className="dashboard-button">
                                View Routes
                            </Link>
                            <Link to="/admin/routes/add" className="dashboard-button">
                                Add New Route
                            </Link>
                        </div>
                    </motion.div>

                    {/* Schedules Card */}
                    <motion.div
                        className="dashboard-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Schedules</h2>
                        <p>Manage bus schedules efficiently.</p>
                        <div className="dashboard-buttons">
                            <Link to="/admin/schedules" className="dashboard-button">
                                View Schedules
                            </Link>
                            <Link to="/admin/schedules/add" className="dashboard-button">
                                Add New Schedule
                            </Link>
                        </div>
                    </motion.div>

                    {/* Buses Card */}
                    <motion.div
                        className="dashboard-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Manage Buses</h2>
                        <p>View and Edit Buses</p>
                        <div className="dashboard-buttons">
                            <Link to="/admin/buses" className="dashboard-button">
                                View Buses
                            </Link>
                            <Link to="/admin/buses/add" className="dashboard-button">
                                Add New Bus
                            </Link>
                        </div>
                    </motion.div>

                    {/* Drivers Card */}
                    <motion.div
                        className="dashboard-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Manage Drivers</h2>
                        <p>View and manage drivers.</p>
                        <div className="dashboard-buttons">
                            <Link to="/admin/drivers" className="dashboard-button">
                                View Drivers
                            </Link>
                            <Link to="/admin/drivers/add" className="dashboard-button">
                                Add New Driver
                            </Link>
                        </div>
                    </motion.div>

                    {/* Fare Management Card */}
                    <motion.div
                        className="dashboard-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Fare Management</h2>
                        <p>Manage and update fares for routes.</p>
                        <div className="dashboard-buttons">
                            <Link to="/admin/fares" className="dashboard-button">
                                View Fares
                            </Link>
                            <Link to="/admin/fares/add" className="dashboard-button">
                                Add New Fare
                            </Link>
                        </div>
                    </motion.div>
                    {/* Refund Management Card */}
                    <motion.div
                        className="dashboard-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Manage Refunds</h2>
                        <p>View and manage all refunds.</p>
                        <div className="dashboard-buttons">
                            <Link to="/admin/refunds" className="dashboard-button">
                                View Refunds
                            </Link>
                        </div>
                    </motion.div>

                    {/* Booking Management Card */}
                    <motion.div
                        className="dashboard-card"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2>Manage Bookings</h2>
                        <p>View and manage all bookings.</p>
                        <div className="dashboard-buttons">
                            <Link to="/admin/bookings" className="dashboard-button">
                                View Bookings
                            </Link>
                        </div>
                    </motion.div>

                    

                </div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
