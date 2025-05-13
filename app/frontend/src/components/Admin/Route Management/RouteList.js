import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RouteList.css";

const RouteList = ({ routes, setRoutes }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [routesPerPage] = useState(10); // Number of routes to display per page
    const [mapLoaded, setMapLoaded] = useState(false); // Track map script loading status
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const navigate = useNavigate();

    // Function to verify if the token exists in localStorage
    const verifyToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first!");
            navigate("/login");
            return false;
        }
        return true;
    };

    // Load Google Maps API script
    const loadGoogleMapsScript = () => {
        const script = document.createElement("script");
        script.src = `https://maps.gomaps.pro/maps/api/js?key=AlzaSywGfIh52dmZ-iKloLft3qFAFidQpJtYPqA&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    };

    useEffect(() => {
        loadGoogleMapsScript();
        window.initMap = () => {
            // Initialize the map with Islamabad as the default center
            const map = new window.google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: { lat: 33.6844, lng: 73.0479 }, // Coordinates for Islamabad
            });
            setMapLoaded(true);
            console.log("Google Maps API loaded with default location Islamabad");
        };
    
        if (verifyToken()) {
            const fetchRoutes = async () => {
                if (!routes || routes.length === 0) {
                    setLoading(true);
                    setError(null);
                    try {
                        const response = await axios.get("http://localhost:5000/api/routes", {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        });
                        setRoutes(response.data);
                    } catch (err) {
                        console.error("Error fetching routes:", err);
                        setError("Failed to fetch routes. Please try again later.");
                    } finally {
                        setLoading(false);
                    }
                }
            };
    
            fetchRoutes();
        }
    }, [routes, setRoutes, navigate]);
    
    // Handle calculating the distance and duration
    const calculateRoute = () => {
        if (start && end && window.google && mapLoaded) {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer();
    
            const map = new window.google.maps.Map(document.getElementById("map"), {
                zoom: 7,
                center: { lat: 33.6844, lng: 73.0479 }, // Coordinates for Islamabad
            });
    
            directionsRenderer.setMap(map);
    
            const request = {
                origin: start,
                destination: end,
                travelMode: window.google.maps.TravelMode.DRIVING,
            };
    
            directionsService.route(request, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                    setDistance(result.routes[0].legs[0].distance.text);
                    setDuration(result.routes[0].legs[0].duration.text);
                } else {
                    alert("Could not calculate the route.");
                }
            });
        } else if (mapLoaded) {
            // If start and end are not provided, show map of Islamabad
            const map = new window.google.maps.Map(document.getElementById("map"), {
                zoom: 10,
                center: { lat: 33.6844, lng: 73.0479 }, // Coordinates for Islamabad
            });
        }
    };

    const deleteRoute = async (id) => {
        if (!verifyToken()) {
            return; // Verify token before deleting
        }
        try {
            await axios.delete(`http://localhost:5000/api/routes/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setRoutes(routes.filter((route) => route._id !== id));
        } catch (err) {
            console.error("Error deleting route:", err);
        }
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

    // Calculate the routes to be displayed on the current page
    const indexOfLastRoute = currentPage * routesPerPage;
    const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
    const currentRoutes = routes.slice(indexOfFirstRoute, indexOfLastRoute);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="home-container">
            <h1 className="dashboard-title">Bus Routes</h1>
            <div className="home-header"></div>
            
            {/* Google Maps Section */}
            <div className="map-container">
                <h2>Check Route Distance</h2>
                <input
                    type="text"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    placeholder="Enter Start Location"
                    className="location-input"
                />
                <input
                    type="text"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    placeholder="Enter End Location"
                    className="location-input"
                />
                <br>
                </br>
                <button onClick={calculateRoute} className="calculate-button">
                    Calculate Route
                </button>
                <div id="map" style={{ height: "400px", width: "100%" }}></div>
                {distance && (
                    <div>
                        <h3>Distance: {distance}</h3>
                        <h3>Duration: {duration}</h3>
                    </div>
                )}
            </div>

            {/* Route List Section */}
            <div className="route-list">
                <h1 className="list-title">Route Details</h1>
                {routes.length === 0 ? (
                    <p>No routes available. Please add a new route.</p>
                ) : (
                    <table className="route-table">
                        <thead>
                            <tr>
                                <th>Start</th>
                                <th>End</th>
                                <th>Stops</th>
                                <th>Distance (km)</th>
                                <th>Estimated Duration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRoutes.map((route) => (
                                <tr key={route._id}>
                                    <td>{route.start}</td>
                                    <td>{route.end}</td>
                                    <td>{route.stops ? route.stops.join(", ") : "None"}</td>
                                    <td>{route.distance}</td>
                                    <td>{route.estimatedDuration || "N/A"}</td>
                                    <td className="actions">
                                        <motion.button
                                            className="edit-button"
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => navigate(`/admin/routes/edit/${route._id}`)}
                                        >
                                            Edit
                                        </motion.button>
                                        <motion.button
                                            className="delete-button"
                                            whileHover={{ scale: 1.1 }}
                                            onClick={() => deleteRoute(route._id)}
                                        >
                                            Delete
                                        </motion.button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <br />
                <motion.button
                    className="add-button"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => navigate("/admin/routes/add")}
                >
                    Add New Route
                </motion.button>

                {/* Pagination Controls */}
                <div className="pagination">
                    {Array.from({ length: Math.ceil(routes.length / routesPerPage) }).map((_, index) => (
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

export default RouteList;
