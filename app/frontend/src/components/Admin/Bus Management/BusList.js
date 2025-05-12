import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BusList.css";

const BusList = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const rowsPerPage = 10; // Number of rows per page
    const navigate = useNavigate();

    // Fetch buses from the backend on component mount
    useEffect(() => {
        const fetchBuses = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get("http://localhost:5000/api/buses", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setBuses(response.data.buses);
            } catch (error) {
                console.error("Error fetching buses:", error);
                setError("Failed to fetch buses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBuses();
    }, []);

    // Handle delete bus
    const deleteBus = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/buses/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            // Remove the bus from the list in the frontend
            setBuses(buses.filter((bus) => bus._id !== id));
            alert("Bus deleted successfully!");
        } catch (error) {
            console.error("Error deleting bus:", error);
            setError("Failed to delete bus. Please try again.");
        }
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentBuses = buses.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(buses.length / rowsPerPage);

    const changePage = (pageNumber) => {
        setCurrentPage(pageNumber);
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
            <h1 className="dashboard-title">Bus Management</h1>
            <div className="home-header"></div>
            <div className="bus-list">
                <h1 className="list-title">Bus Details</h1>
                {buses.length === 0 ? (
                    <p>No buses available. Please add a new bus.</p>
                ) : (
                    <>
                        <table className="bus-table">
                            <thead>
                                <tr>
                                    <th>License Plate</th>
                                    <th>Capacity</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Driver</th> {/* Change this to Driver */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBuses.map((bus) => (
                                    <tr key={bus._id}>
                                        <td>{bus.licensePlate}</td>
                                        <td>{bus.capacity}</td>
                                        <td>{bus.type}</td>
                                        <td>{bus.status}</td>
                                        <td>{bus.driver ? bus.driver.name : "Not Assigned"}</td> {/* Display Driver Name */}
                                        <td className="actions">
                                            <motion.button
                                                className="edit-button"
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => navigate(`/admin/buses/edit/${bus._id}`)}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                className="delete-button"
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => deleteBus(bus._id)}
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
                    onClick={() => navigate("/admin/buses/add")}
                >
                    Add New Bus
                </motion.button>
            </div>
        </div>
    );
};

export default BusList;
