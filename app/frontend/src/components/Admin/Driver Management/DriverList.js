import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./DriverList.css";

const DriverList = ({ drivers, setDrivers }) => {
    const navigate = useNavigate();

    const deleteDriver = (id) => {
        setDrivers(drivers.filter((driver) => driver.id !== id));
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Driver Management</h1>
            <div className="home-header"></div>
            <div className="driver-list">
                <h1 className="list-title">Driver Details</h1>
                <table className="driver-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>License</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver.id}>
                                <td>{driver.id}</td>
                                <td>{driver.name}</td>
                                <td>{driver.phone}</td>
                                <td>{driver.license}</td>
                                <td className="actions">
                                    <motion.button
                                        className="edit-button"
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => navigate(`/admin/drivers/edit/${driver.id}`)}
                                    >
                                        Edit
                                    </motion.button>
                                    <motion.button
                                        className="delete-button"
                                        whileHover={{ scale: 1.1 }}
                                        onClick={() => deleteDriver(driver.id)}
                                    >
                                        Delete
                                    </motion.button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <motion.button
                    className="add-button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => navigate("/admin/drivers/add")}
                >
                    Add New Driver
                </motion.button>
            </div>
        </div>
    );
};

export default DriverList;
