import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./AddDriver.css";

const AddDriver = ({ drivers, setDrivers }) => {
    const [formData, setFormData] = useState({ name: "", phone: "", license: "" });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.license) {
            alert("All fields are required!");
            return;
        }

        const newDriver = {
            id: drivers.length + 1, // Simple ID generation
            name: formData.name,
            phone: formData.phone,
            license: formData.license,
        };
        setDrivers([...drivers, newDriver]);
        alert("Driver added successfully!");
        navigate("/admin/drivers");
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Add Driver</h1>
            <div className="home-header"></div>
            <motion.div
                className="add-driver"
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Add New Driver</h1>
                <form onSubmit={handleSubmit} className="driver-form">
                    <label>Driver Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Driver Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                    <label>License Number</label>
                    <input
                        type="text"
                        name="license"
                        placeholder="License Number"
                        value={formData.license}
                        onChange={handleInputChange}
                        required
                    />
                    <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.1 }}
                    >
                        Add Driver
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddDriver;
