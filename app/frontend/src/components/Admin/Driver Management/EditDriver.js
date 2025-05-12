import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./EditDriver.css";

const EditDriver = ({ drivers, setDrivers }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", phone: "", license: "" });

    useEffect(() => {
        const driverToEdit = drivers.find((driver) => driver.id === parseInt(id));
        if (driverToEdit) {
            setFormData({
                name: driverToEdit.name,
                phone: driverToEdit.phone,
                license: driverToEdit.license,
            });
        } else {
            navigate("/admin/drivers");
        }
    }, [id, drivers, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.license) {
            alert("All fields are required!");
            return;
        }

        const updatedDriver = { ...formData, id: parseInt(id) };
        setDrivers((prevDrivers) =>
            prevDrivers.map((driver) =>
                driver.id === parseInt(id) ? updatedDriver : driver
            )
        );
        alert("Driver updated successfully!");
        navigate("/admin/drivers");
    };

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Edit Driver</h1>
            <div className="home-header"></div>
            <motion.div
                className="edit-driver"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="form-title">Edit Driver</h1>
                <form onSubmit={handleSubmit} className="driver-form">
                    <label>Driver Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                    <label>License Number</label>
                    <input
                        type="text"
                        name="license"
                        value={formData.license}
                        onChange={handleInputChange}
                        required
                    />
                    <motion.button
                        type="submit"
                        className="submit-button"
                        whileHover={{ scale: 1.1 }}
                    >
                        Update Driver
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EditDriver;
