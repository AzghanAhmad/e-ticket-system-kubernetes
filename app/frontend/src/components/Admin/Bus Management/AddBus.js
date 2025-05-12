import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddBus.css";

const AddBus = ({ routes }) => {
    const [formData, setFormData] = useState({
        licensePlate: "",
        capacity: "",
        type: "Non-AC",
        driver: "", // Driver ID
        status: "Active",
        features: "",
    });
    const [drivers, setDrivers] = useState([]); // To store list of drivers
    const navigate = useNavigate();

    // Fetch drivers from the backend
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/drivers", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.data.drivers) {
                    setDrivers(response.data.drivers); // Store the array of drivers
                }
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        };

        fetchDrivers();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.licensePlate || !formData.capacity || !formData.driver) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/buses", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            alert("Bus added successfully!");
            navigate("/admin/buses");
        } catch (error) {
            console.error("Error adding bus:", error);
            alert("Failed to add bus. Please try again.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Add Bus</h1>
            <div className="home-header"></div>
            
            <motion.div
                className="add-bus"
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Add New Bus</h1>
                <form onSubmit={handleSubmit} className="bus-form">
                    <input
                        type="text"
                        name="licensePlate"
                        placeholder="License Plate"
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="capacity"
                        placeholder="Capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                    >
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                    </select>
                    <select
                        name="driver"
                        value={formData.driver}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Driver</option>
                        {drivers && drivers.length > 0 ? (
                            drivers.map((driver) => (
                                <option key={driver._id} value={driver._id}>
                                    {driver.name} (ID: {driver._id})
                                </option>
                            ))
                        ) : (
                            <option disabled>No drivers available</option>
                        )}
                    </select>
                    
                    <textarea
                        name="features"
                        placeholder="Bus Features (comma separated)"
                        value={formData.features}
                        onChange={handleInputChange}
                    />
                    <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.1 }}
                    >
                        Add Bus
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddBus;
