import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./FareList.css";

const FareList = ({ fares, setFares }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const rowsPerPage = 10; // Number of rows per page

    // Fetch fares from the backend
    useEffect(() => {
        const fetchFares = async () => {
            if (!fares || fares.length === 0) {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get("http://localhost:5000/api/fares", {
                        params: { fields: "route,baseFare,additionalFarePerStop,createdAt,updatedAt" }, // Fetch necessary fields
                    });
                    setFares(response.data.fares);
                } catch (err) {
                    console.error("Error fetching fares:", err);
                    setError("Failed to fetch fares. Please try again later.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchFares();
    }, [fares, setFares]);

    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString(); // Example: "MM/DD/YYYY"
        const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }); // HH:MM:SS
        return (
            <div>
                <div>{formattedDate}</div>
                <div>{formattedTime}</div>
            </div>
        );
    };

    const deleteFare = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/fares/${id}`);
            setFares(fares.filter((fare) => fare._id !== id));
        } catch (err) {
            console.error("Error deleting fare:", err);
            setError("Failed to delete fare. Please try again later.");
        }
    };

    // Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentFares = fares.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(fares.length / rowsPerPage);

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
            <h1 className="dashboard-title">Fare Management</h1>
            <div className="home-header"></div>
            <div className="fare-list">
                <h1 className="list-title">Fare Details</h1>
                {fares.length === 0 ? (
                    <p>No fares available. Please add a new fare.</p>
                ) : (
                    <>
                        <table className="fare-table">
                            <thead>
                                <tr>
                                    <th>Route</th>
                                    <th>Base Fare (PKR)</th>
                                    <th>Additional Fare Per Stop (PKR)</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFares.map((fare) => (
                                    <tr key={fare._id}>
                                        <td>{fare.route ? `${fare.route.start} to ${fare.route.end}` : "N/A"}</td>
                                        <td>{fare.baseFare}</td>
                                        <td>{fare.additionalFarePerStop}</td>
                                        <td>{formatDateTime(fare.createdAt)}</td>
                                        <td>{formatDateTime(fare.updatedAt)}</td>
                                        <td className="actions">
                                            <motion.button
                                                className="edit-button"
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => navigate(`/admin/fares/edit/${fare._id}`)}
                                            >
                                                Edit
                                            </motion.button>
                                            <motion.button
                                                className="delete-button"
                                                whileHover={{ scale: 1.1 }}
                                                onClick={() => deleteFare(fare._id)}
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
                                    className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
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
                    onClick={() => navigate("/admin/fares/add")}
                >
                    Add New Fare
                </motion.button>
            </div>
        </div>
    );
};

export default FareList;
