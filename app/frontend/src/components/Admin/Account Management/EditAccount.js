import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for HTTP requests
import "./EditAccount.css";

const EditAccount = ({ admins, setAdmins }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
    });
    const { id } = useParams();
    const navigate = useNavigate();

    // Load admin data for editing
    useEffect(() => {
        if (id) {
            const adminToEdit = admins.find((admin) => admin._id === id); // Match by _id
            setFormData(
                adminToEdit || {
                    name: "",
                    email: "",
                    role: "",
                }
            );
        }
    }, [id, admins]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields are filled
        if (!formData.name || !formData.email || !formData.role) {
            alert("All fields are required!");
            return;
        }

        try {
            // Send a PUT request to the backend to update the admin details
            const response = await axios.put(
                `http://localhost:5000/api/admins/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // Update the admin list in the frontend after successful update
            setAdmins((prevAdmins) =>
                prevAdmins.map((admin) =>
                    admin._id === id ? response.data : admin
                )
            );

            alert("Admin details updated successfully!");
            navigate("/admin/accounts");
        } catch (error) {
            console.error("Error updating admin details:", error);
            alert("Failed to update admin details. Please try again.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Edit Admin</h1>
            <div className="home-header"></div>
            <motion.div
                className="edit-admin"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Edit Admin</h1>
                <form onSubmit={handleSubmit} className="admin-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="Admin Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Admin Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="role"
                        placeholder="Admin Role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                    />
                    <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.1 }}
                    >
                        Update
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditAccount;
