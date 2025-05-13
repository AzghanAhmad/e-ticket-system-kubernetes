import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ScheduleList.css";

const ScheduleList = ({ schedules, setSchedules }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const rowsPerPage = 10; // Number of rows per page
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchedules = async () => {
            if (!schedules || schedules.length === 0) {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get("http://localhost:5000/api/schedules", {
                        params: {
                            fields: "departureTime,arrivalTime,status,route,bus", // Request necessary fields
                        },
                    });
                    setSchedules(response.data.schedules); // Ensure you're using 'schedules' from response
                } catch (err) {
                    console.error("Error fetching schedules:", err);
                    setError("Failed to fetch schedules. Please try again later.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSchedules();
    }, [schedules, setSchedules]);

    const formatTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // HH:MM
        return <div>{formattedTime}</div>;
    };

    const deleteSchedule = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/schedules/${id}`);
            setSchedules(schedules.filter((schedule) => schedule._id !== id));
        } catch (err) {
            console.error("Error deleting schedule:", err);
            setError("Failed to delete schedule. Please try again later.");
        }
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentSchedules = schedules.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(schedules.length / rowsPerPage);

    const changePage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const navigateToEdit = (scheduleId) => {
        navigate(`/admin/schedules/edit/${scheduleId}`);
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
            <h1 className="dashboard-title">Schedules</h1>
            <div className="home-header"></div>
            <div className="schedule-list">
                <h1 className="list-title">Schedule Details</h1>
                {schedules.length === 0 ? (
                    <p>No schedules available. Please add a new schedule.</p>
                ) : (
                    <>
                        <table className="schedule-table">
                            <thead>
                                <tr>
                                    <th>Departure Time</th>
                                    <th>Arrival Time</th>
                                    <th>Status</th>
                                    <th>Route</th>
                                    <th>Bus License</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSchedules.map((schedule) => (
                                    <tr key={schedule._id}>
                                        <td>{formatTime(schedule.departureTime)}</td>
                                        <td>{formatTime(schedule.arrivalTime)}</td>
                                        <td>{schedule.status}</td>
                                        <td>{schedule.route ? `${schedule.route.start} to ${schedule.route.end}` : "N/A"}</td>
                                        <td>{schedule.bus ? schedule.bus.licensePlate : "N/A"}</td>
                                        <td className="actions">
                                            <motion.button
                                                className="edit-button"
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => navigateToEdit(schedule._id)}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                className="delete-button"
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => deleteSchedule(schedule._id)}
                                            >
                                                Delete
                                            </motion.button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`page-button ${
                                        currentPage === index + 1 ? "active" : ""
                                    }`}
                                    onClick={() => changePage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
                <br />
                <motion.button
                    className="add-button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => navigate("/admin/schedules/add")}
                >
                    Add New Schedule
                </motion.button>
            </div>
        </div>
    );
};

export default ScheduleList;
