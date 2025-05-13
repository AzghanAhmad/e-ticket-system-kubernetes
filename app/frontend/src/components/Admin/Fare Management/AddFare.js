import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddFare.css";

const AddFare = ({ fares, setFares }) => {
    const [formData, setFormData] = useState({ route: "", busType: "", baseFare: "", additionalFarePerStop: "" });
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // Fetch routes only (no need to fetch bus types anymore)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const routesResponse = await axios.get("http://localhost:5000/api/routes");
                setRoutes(routesResponse.data);
            } catch (err) {
                console.error("Error fetching routes:", err);
                setError("Failed to fetch routes. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { route, busType, baseFare, additionalFarePerStop } = formData;

        if (!route || !busType || !baseFare) {
            alert("All fields are required!");
            return;
        }

        // Prepare data for submission
        const newFare = {
            route, 
            busType,
            baseFare: parseFloat(baseFare),
            additionalFarePerStop: parseFloat(additionalFarePerStop || 0),
        };

        try {
            // Send a POST request to add the new fare
            const response = await axios.post("http://localhost:5000/api/fares", newFare, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
                },
            });

            // Update the fares state with the new fare added
            setFares([...fares, response.data]);
            alert("Fare added successfully!");
            navigate("/admin/fares");
        } catch (err) {
            console.error("Error adding fare:", err);
            alert("Failed to add fare.");
        }
    };

    if (loading) {
        return (
            <motion.div animate={{ scale: [0.8, 1] }} className="loading">
                Loading...
            </motion.div>
        );
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Add Fare</h1>
            <div className="home-header"></div>
            <motion.div
                className="add-fare"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Add Fare</h1>
                <form onSubmit={handleSubmit} className="fare-form">
                    <select name="route" value={formData.route} onChange={handleInputChange} required>
                        <option value="">Select Route</option>
                        {routes && routes.length > 0 ? (
                            routes.map((route) => (
                                <option key={route._id} value={route._id}>
                                    {`${route.start} to ${route.end}`}
                                </option>
                            ))
                        ) : (
                            <option disabled>No routes available</option>
                        )}
                    </select>

                    {/* Updated bus type input field */}
                    <input
                        type="text"
                        name="busType"
                        placeholder="Enter Bus Type"
                        value={formData.busType}
                        onChange={handleInputChange}
                        required
                    />

                    <input
                        type="number"
                        name="baseFare"
                        placeholder="Base Fare (PKR)"
                        value={formData.baseFare}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="number"
                        name="additionalFarePerStop"
                        placeholder="Additional Fare Per Stop (PKR)"
                        value={formData.additionalFarePerStop}
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

export default AddFare;
