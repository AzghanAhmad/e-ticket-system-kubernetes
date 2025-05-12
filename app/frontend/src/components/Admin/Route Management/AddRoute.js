import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddRoute.css";

const AddRoute = ({ routes, setRoutes }) => {
    const [formData, setFormData] = useState({ start: "", end: "", stops: "", distance: "", estimatedDuration: "" });
    const navigate = useNavigate();

    // Handle form field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { start, end, stops, distance, estimatedDuration } = formData;

        if (!start || !end || !distance || !estimatedDuration) {
            alert("All fields except stops are required!");
            return;
        }

        // Prepare data for submission
        const newRoute = {
            start,
            end,
            stops: stops ? stops.split("\n").map((stop) => stop.trim()) : [], // Convert stops back to an array
            distance,
            estimatedDuration,
        };

        try {
            // Send a POST request to add the new route
            const response = await axios.post("http://localhost:5000/api/routes", newRoute, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
                },
            });

            // Update the routes state with the new route added
            setRoutes([...routes, response.data]);
            alert("Route added successfully!");
            navigate("/admin/routes");
        } catch (err) {
            console.error("Error adding route:", err);
            alert("Failed to add route.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Add Bus Route</h1>
            <div className="home-header"></div>
            <motion.div
                className="add-route"
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Add New Route</h1>
                <form onSubmit={handleSubmit} className="route-form">
                    <input
                        type="text"
                        name="start"
                        placeholder="Start Location"
                        value={formData.start}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="end"
                        placeholder="End Location"
                        value={formData.end}
                        onChange={handleInputChange}
                        required
                    />
                    <textarea
                        name="stops"
                        placeholder="Stops (one per line)"
                        value={formData.stops}
                        onChange={handleInputChange}
                        rows="4"
                    />
                    <input
                        type="number"
                        name="distance"
                        placeholder="Distance (km)"
                        value={formData.distance}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="estimatedDuration"
                        placeholder="Estimated Duration"
                        value={formData.estimatedDuration}
                        onChange={handleInputChange}
                        required
                    />
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

export default AddRoute;
