import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RefundManagement.css";

const RefundManagement = () => {
    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [refundsPerPage] = useState(10);

    const navigate = useNavigate();

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
            const fetchRefunds = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get("http://localhost:5000/api/admin/refunds", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    setRefunds(response.data);
                } catch (err) {
                    console.error("Error fetching refunds:", err);
                    setError("Failed to fetch refunds. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };

            fetchRefunds();
        }
    }, [navigate]);

    const approveRefund = async (refundId) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/admin/refunds/${refundId}/approve`,  // Fixed endpoint URL
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const updatedRefund = response.data.refund;
            setRefunds((prevRefunds) =>
                prevRefunds.map((refund) =>
                    refund._id === refundId ? updatedRefund : refund
                )
            );
            alert("Refund approved successfully!");
        } catch (error) {
            if (error.response?.status === 404) {
                alert("Refund not found.");
            } else if (error.response?.status === 400) {
                alert("Only pending refunds can be approved.");
            } else {
                alert("Failed to approve refund. Please try again later.");
            }
            console.error("Error approving refund:", error);
        }
    };

    const indexOfLastRefund = currentPage * refundsPerPage;
    const indexOfFirstRefund = indexOfLastRefund - refundsPerPage;
    const currentRefunds = refunds.slice(indexOfFirstRefund, indexOfLastRefund);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <div className="refund-container">
            <h1 className="dashboard-title">Refund Management</h1>
            <div className="home-header"></div>
            <div className="refund-list">
                <h1 className="list-title">Refund Details</h1>
                {refunds.length === 0 ? (
                    <p>No refunds available. Please add a new refund.</p>
                ) : (
                    <table className="refund-table">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Refund Amount</th>
                                <th>Refund Status</th>
                                <th>Reason</th>
                                <th>Request Date</th>
                                <th>Processed Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRefunds.map((refund) => {
                                const customerName = refund.booking?.customerName || "Unknown";
                                const requestDate = new Date(refund.requestDate).toLocaleDateString();
                                const processedDate = refund.processedDate
                                    ? new Date(refund.processedDate).toLocaleDateString()
                                    : "N/A"; // Show processed date if available
                                return (
                                    <tr key={refund._id}>
                                        <td>{customerName}</td>
                                        <td>${refund.refundAmount}</td>
                                        <td>{refund.refundStatus}</td>
                                        <td>{refund.reason}</td>
                                        <td>{requestDate}</td>
                                        <td>{processedDate}</td>
                                        <td className="actions">
                                            {refund.refundStatus === "approved" ? (
                                                <p className="approved-message">Already Approved</p>
                                            ) : (
                                                <motion.button
                                                    className="approve-button"
                                                    whileHover={{ scale: 1.1 }}
                                                    onClick={() => approveRefund(refund._id)}
                                                >
                                                    Approve Refund
                                                </motion.button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                <br />
                <motion.button
                    className="add-button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => navigate("/admin/refunds/add")}
                >
                    Add New Refund
                </motion.button>

                <div className="pagination">
                    {Array.from({ length: Math.ceil(refunds.length / refundsPerPage) }).map((_, index) => (
                        <button
                            key={index + 1}
                            className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
                            onClick={() => paginate(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RefundManagement;
