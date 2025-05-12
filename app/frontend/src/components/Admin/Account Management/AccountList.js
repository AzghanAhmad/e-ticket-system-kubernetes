import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccountList.css";

const AccountList = ({ admins, setAdmins }) => {
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors
    const [filterAdmins, setFilterAdmins] = useState([]); // Track filtered admins
    const [showOnlyAdmins, setShowOnlyAdmins] = useState(false); // Track filter toggle
    const navigate = useNavigate();

    // Verify token presence
    const verifyToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first!");
            navigate("/login");
            return false;
        }
        return true;
    };

    // Fetch admin data from backend
    useEffect(() => {

        
        if (verifyToken()) {
            const fetchAdmins = async () => {
                try {
                    setError(null); // Reset any previous errors
                    const response = await axios.get("http://localhost:5000/api/admins", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    setAdmins(response.data);
                    setFilterAdmins(response.data); // Initialize filterAdmins with all data
                } catch (err) {
                    console.error("Error fetching admins:", err);
                    setError("Failed to fetch admins. Please try again later.");
                } finally {
                    setLoading(false); // Loading complete
                }
            };
            fetchAdmins();
        }
    }, [setAdmins, navigate]);

    // Delete an admin
    const deleteAdmin = async (id) => {
        if (!verifyToken()) {
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/admins/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setFilterAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
            setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
        } catch (err) {
            console.error("Error deleting admin:", err);
            setError("Failed to delete admin. Please try again later.");
        }
    };

    // Toggle filter for showing only admins
    const toggleShowOnlyAdmins = () => {
        if (showOnlyAdmins) {
            setFilterAdmins(admins); // Reset to show all users
        } else {
            setFilterAdmins(admins.filter((admin) => admin.role === "admin")); // Filter for admins
        }
        setShowOnlyAdmins(!showOnlyAdmins); // Toggle state
    };

    if (loading) {
        return <motion.div animate={{ scale: [0.8, 1] }} className="loading">Loading...</motion.div>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="home-container">
            <h1 className="dashboard-title">User Accounts</h1>
            <div className="home-header"></div>
            <div className="admin-list">
                <h1 className="list-title">Account Details</h1>
                <div className="filter-controls">
                    <motion.button
                        className="add-button"
                        whileHover={{ scale: 1.1 }}
                        onClick={toggleShowOnlyAdmins}
                    >
                        {showOnlyAdmins ? "Show All Users" : "Show Only Admins"}
                    </motion.button>
                </div>
                {filterAdmins.length === 0 ? (
                    <p>No users found. Please add a new user.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterAdmins.map((admin) => (
                                <tr key={admin._id}>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.role}</td>
                                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <motion.button
                                            className="edit-button"
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => navigate(`/admin/accounts/edit/${admin._id}`)}
                                        >
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            className="delete-button"
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => deleteAdmin(admin._id)}
                                        >
                                            Delete
                                        </motion.button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <br />
                <motion.button
                    className="add-button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => navigate("/admin/accounts/add")}
                >
                    Add New Admin
                </motion.button>
                
            </div>
        </div>
    );
};

export default AccountList;
