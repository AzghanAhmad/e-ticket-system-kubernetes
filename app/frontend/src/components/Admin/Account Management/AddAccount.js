import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios for HTTP requests
import "./AddAccount.css";

const AddAccount = ({ setAdmins }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Admin",
    }); // Include password
    const navigate = useNavigate();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields are filled
        if (!formData.name || !formData.email || !formData.password || !formData.role) {
            alert("All fields are required!");
            return;
        }

        try {
            // Send a POST request to the backend to add the new user
            const response = await axios.post(
                "http://localhost:5000/api/users", // Endpoint for adding user
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // Add the new user to the frontend state
            setAdmins((prevAdmins) => [...prevAdmins, response.data]);

            alert("User added successfully!");
            navigate("/admin/accounts");
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user. Please try again.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Add User</h1>
            <div className="home-header"></div>
            <motion.div
                className="add-admin"
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Add New User</h1>
                <form onSubmit={handleSubmit} className="admin-form">
                    <input
                        type="text"
                        name="name"
                        placeholder="User Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="User Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                        <option value="bus manager">Bus Manager</option>
                        {/* Add other roles as needed */}
                    </select>
                    <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.1 }}
                    >
                        Submit
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddAccount;
