import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditRoute.css";

const EditRoute = ({ routes, setRoutes }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Note: id is now _id as used in the RouteList
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        start: "",
        end: "",
        stops: "",
        distance: "",
        estimatedDuration: "",
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
            const fetchRoute = async () => {
                if (!routes || routes.length === 0) {
                    setLoading(true);
                    setError(null);
                try {
                    const routeToEdit = await axios.get(`http://localhost:5000/api/routes/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    console.log(routeToEdit.data);
                    if (routeToEdit.data) {
                        // Convert stops array to comma-separated string for easy editing
                        const updatedData = {
                            ...routeToEdit.data,
                        };
                        setFormData(updatedData);
                    } else {
                        alert("Route not found!");
                        navigate("/admin/routes");
                    }
                } catch (err) {
                    console.error("Error fetching route:", err);
                    alert("Failed to fetch route details.");
                    navigate("/admin/routes");
                }
            }
            };

            fetchRoute();
        }
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!verifyToken()) return; // Check token before submitting

        const { start, end, stops, distance, estimatedDuration } = formData;

        if (!start || !end || !distance || !estimatedDuration) {
            alert("All fields except stops are required!");
            return;
        }

        const updatedRoute = {
            start,
            end,
            stops: stops ? stops.split("\n").map((stop) => stop.trim()) : [], // Convert stops back to an array
            distance,
            estimatedDuration,
        };

        try {
            await axios.put(`http://localhost:5000/api/routes/${id}`, updatedRoute, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setRoutes((prevRoutes) =>
                prevRoutes.map((route) =>
                    route._id === id ? { ...route, ...updatedRoute } : route
                )
            );
            alert("Route updated successfully!");
            navigate("/admin/routes");
        } catch (err) {
            console.error("Error updating route:", err);
            alert("Failed to update route.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Edit Bus Route</h1>
            <div className="home-header"></div>
            <motion.div
                className="edit-route"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Edit Route</h1>
                {/* Add a header above all the fields */}
                <h2 className="form-header">Please update the route details below:</h2>
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
                    {/* Separate stops input without commas */}
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
                        Save Changes
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditRoute;
