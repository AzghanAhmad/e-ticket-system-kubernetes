import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./BookingManagement.css"; // Assuming you are creating a similar CSS file for BookingManagement

const BookingManagement = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/admin/bookings");
                setBookings(response.data);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="booking-container">
            <h1 className="dashboard-title">Booking Management</h1>
            <div className="home-header"></div>
            <div className="booking-list">
                <h1 className="list-title">Booking Details</h1>
                {bookings.length === 0 ? (
                    <p>No bookings available.</p>
                ) : (
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Seats Booked</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.customerName}</td>
                                    <td>{booking.seatsBooked}</td>
                                    <td>{booking.paymentStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                
            </div>
        </div>
    );
};

export default BookingManagement;
