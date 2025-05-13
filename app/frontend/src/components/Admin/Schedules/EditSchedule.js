import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./EditSchedule.css";

const EditSchedule = ({ schedules, setSchedules }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        departureTime: "",
        arrivalTime: "",
        status: "",
        route: "",
        bus: "",
    });
    const [busList, setBusList] = useState([]); // State to store available buses
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the selected schedule
        const scheduleToEdit = schedules.find((schedule) => schedule._id === id);
        if (scheduleToEdit) {
            setFormData({
                departureTime: new Date(scheduleToEdit.departureTime).toISOString().slice(0, 16),
                arrivalTime: new Date(scheduleToEdit.arrivalTime).toISOString().slice(0, 16),
                status: scheduleToEdit.status,
                route: scheduleToEdit.route
                    ? `${scheduleToEdit.route.start} to ${scheduleToEdit.route.end}`
                    : "",
                bus: scheduleToEdit.bus ? scheduleToEdit.bus.licensePlate : "",
            });
        } else {
            navigate("/admin/schedules");
        }

        // Fetch available buses
        const fetchBuses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/buses");
                setBusList(response.data.buses); // Assuming the response contains a 'buses' array
            } catch (err) {
                console.error("Error fetching buses:", err);
                setError("Failed to fetch available buses. Please try again later.");
            }
        };

        fetchBuses();
    }, [id, schedules, navigate]);

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

            const updatedSchedule = {
                departureTime: new Date(formData.departureTime).toISOString(),
                arrivalTime: new Date(formData.arrivalTime).toISOString(),
                status: formData.status,
                route: { start, end },
                bus: { licensePlate: formData.bus },
            };

            await axios.put(`http://localhost:5000/api/schedules/${id}`, updatedSchedule);

            setSchedules((prevSchedules) =>
                prevSchedules.map((schedule) =>
                    schedule._id === id ? { ...schedule, ...updatedSchedule } : schedule
                )
            );

            alert("Schedule updated successfully!");
            navigate("/admin/schedules");
        } catch (err) {
            console.error("Error updating schedule:", err);
            setError("Failed to update schedule. Please try again later.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Edit Schedule</h1>
            <div className="home-header"></div>
            <motion.div
                className="edit-schedule"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Edit Schedule</h1>
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
                    />
                    <label>Route</label>
                    <input
                        type="text"
                        name="route"
                        value={formData.route}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., City A to City B"
                    />
                    <label>Bus License</label>
                    <select
                        name="bus"
                        value={formData.bus}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled>
                            Select Bus License
                        </option>
                        {busList.map((bus) => (
                            <option key={bus._id} value={bus.licensePlate}>
                                {bus.licensePlate}
                            </option>
                        ))}
                    </select>
                    <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.1 }}
                    >
                        Update Schedule
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditSchedule;
