import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddSchedule.css";

const AddSchedule = ({ setSchedules }) => {
    const [formData, setFormData] = useState({
        departureTime: "",
        arrivalTime: "",
        status: "",
        route: "",
        bus: "",
    });
    const [busList, setBusList] = useState([]);
    const [routeList, setRouteList] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch available buses and routes
        const fetchData = async () => {
            try {
                const busResponse = await axios.get("http://localhost:5000/api/buses");
                const routeResponse = await axios.get("http://localhost:5000/api/routes");

                // Ensure the response contains valid data for buses
                if (busResponse.data && Array.isArray(busResponse.data.buses)) {
                    setBusList(busResponse.data.buses);
                } else {
                    setError("No buses found.");
                }

                // Ensure the response contains valid data for routes
                if (routeResponse.data && Array.isArray(routeResponse.data)) {
                    setRouteList(routeResponse.data);
                } else {
                    setError("No routes found.");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch available buses or routes. Please try again later.");
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

        if (!formData.departureTime || !formData.arrivalTime || !formData.status || !formData.route || !formData.bus) {
            alert("All fields are required!");
            return;
        }

        try {
            const [start, end] = formData.route.split(" to ");

            const newSchedule = {
                departureTime: new Date(formData.departureTime).toISOString(),
                arrivalTime: new Date(formData.arrivalTime).toISOString(),
                status: formData.status,
                route: formData.route,
                bus: formData.bus,
            };

            const response = await axios.post("http://localhost:5000/api/schedules", newSchedule);

            setSchedules((prevSchedules) => [...prevSchedules, response.data]);

            alert("Schedule added successfully!");
            navigate("/admin/schedules");
        } catch (err) {
            console.error("Error adding schedule:", err);
            setError("Failed to add schedule. Please try again later.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Add Schedule</h1>
            <div className="home-header"></div>
            <motion.div
                className="add-schedule"
                initial={{ x: "-100vw" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Add New Schedule</h1>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="schedule-form">
                    <label>Departure Time</label>
                    <input
                        type="datetime-local"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Arrival Time</label>
                    <input
                        type="datetime-local"
                        name="arrivalTime"
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Status</label>
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Scheduled, Delayed"
                    />
                    <label>Route</label>
                    <select
                        name="route"
                        value={formData.route}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Select Route
                        </option>
                        {routeList.length > 0 ? (
                            routeList.map((route) => (
                                <option key={route._id} value={route._id}>
                                    {route.start} to {route.end}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading routes...</option>
                        )}
                    </select>
                    <label>Bus License</label>
                    <select
                        name="bus"
                        value={formData.bus}
                        onChange={handleInputChange}
                        required
                    >
                         <option value="" disabled>
                            Select Bus
                        </option>
                        {busList.map((bus) => (
                            <option key={bus._id} value={bus._id}>
                                {bus.licensePlate}
                            </option>
                        ))}
                    </select>
                    <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.1 }}
                    >
                        Add Schedule
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default AddSchedule;
