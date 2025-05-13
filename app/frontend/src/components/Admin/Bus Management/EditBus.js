import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditBus.css";

const EditBus = ({ buses, setBuses }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        licensePlate: "",
        capacity: "",
        type: "Non-AC",
        status: "Active", // Add status here
        driverName: "", // Driver's name instead of assignedRoute
    });

    // Function to verify if the token exists in localStorage
    const verifyToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first!");
            navigate("/login");
            return false;
        }
        return true;
    };

    useEffect(() => {
        if (verifyToken()) {
            const fetchBus = async () => {
                if (!buses || buses.length === 0) {
                    setLoading(true);
                    setError(null);
                    try {
                        const busToEdit = await axios.get(
                            `http://localhost:5000/api/buses/${id}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            }
                        );
                        if (busToEdit.data) {
                            // Set form data with the bus and driver details
                            const bus = busToEdit.data;
                            const driver = bus.driver || {};  // Ensure driver is available
                            setFormData({
                                licensePlate: bus.licensePlate,
                                capacity: bus.capacity,
                                type: bus.type,
                                status: bus.status || "Active", // Default to "Active"
                                driverName: driver.name || "", // Set driver's name here
                            });
                        } else {
                            alert("Bus not found!");
                            navigate("/admin/buses");
                        }
                    } catch (err) {
                        console.error("Error fetching bus:", err);
                        alert("Failed to fetch bus details.");
                        navigate("/admin/buses");
                    }
                }
            };
            fetchBus();
        }
    }, [id, navigate, buses]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!verifyToken()) return; // Check token before submitting

        const { licensePlate, capacity, driverName, status } = formData;

        if (!licensePlate || !capacity || !driverName) {
            alert("All fields are required!");
            return;
        }

        const updatedBus = {
            licensePlate,
            capacity,
            type: formData.type,
            status,  // Use status here
            driverName,  // Send driverName instead of assignedRoute
        };

        try {
            await axios.put(
                `http://localhost:5000/api/buses/${id}`,
                updatedBus,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            // Update the buses list in the parent component
            setBuses((prevBuses) =>
                prevBuses.map((bus) =>
                    bus._id === id ? { ...bus, ...updatedBus } : bus
                )
            );
            alert("Bus details updated successfully!");
            navigate("/admin/buses");
        } catch (err) {
            console.error("Error updating bus:", err);
            alert("Failed to update bus.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Edit Bus</h1>
            <motion.div
                className="edit-bus"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Edit Bus Details</h1>
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
                    <input
                        type="text"
                        name="driverName"
                        placeholder="Driver Name"
                        value={formData.driverName}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    
                    <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.1 }}
                    >
                        Save Changes
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditBus;
