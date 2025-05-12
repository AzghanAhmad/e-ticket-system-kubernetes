import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import "./EditFare.css";

const EditFare = ({ fares, setFares,buses }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        routeName: "",
        busType: "",
        fare: "",
    });

    useEffect(() => {
        // Find the fare to edit by ID
        const fareToEdit = fares.find((fare) => fare.id === parseInt(id));
        if (fareToEdit) {
            setFormData({
                routeName: fareToEdit.routeName,
                busType: fareToEdit.busType,
                fare: fareToEdit.amount,
            });
        } else {
            alert("Fare not found!");
            navigate("/admin/fares");
        }
    }, [id, fares, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { busType, fare } = formData;

        if (!fare || !busType) {
            alert("All fields are required!");
            return;
        }

        setFares((prevFares) =>
            prevFares.map((fareItem) =>
                fareItem.id === parseInt(id)
                    ? { ...fareItem, busType: busType, amount: fare }
                    : fareItem
            )
        );

        alert("Fare updated successfully!");
        navigate("/admin/fares");
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Edit Fare</h1>
            <div className="home-header"></div>
            <motion.div
                className="edit-fare"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Edit Fare</h1>
                <form onSubmit={handleSubmit} className="fare-form">
                    <label>Route</label>
                    <input
                        type="text"
                        name="routeName"
                        value={formData.routeName}
                        readOnly
                    />

                    <label>Bus Type</label>
                    <select
                        name="busType"
                        value={formData.busType}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Bus Type</option>
                        {buses.map((bus) => (
                            <option key={bus.type} value={bus.type}>
                                {bus.type}
                            </option>
                        ))}
                    </select>

                    <label>Fare</label>
                    <input
                        type="number"
                        name="fare"
                        placeholder="Enter Fare"
                        value={formData.fare}
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

export default EditFare;
