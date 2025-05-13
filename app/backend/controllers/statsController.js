import Bus from '../models/bus.js';
import Refund from '../models/refund.js';
import Driver from '../models/driver.js';
import User from '../models/user.js';

export const getStats = async (req, res) => {
    try {
        // Calculate total buses
        const totalBuses = await Bus.countDocuments();

        // Calculate buses currently on a route
        const busesOnRoute = await Bus.countDocuments({ status: 'Active' });

        // Calculate total drivers
        const totalDrivers = await Driver.countDocuments();

        // Calculate pending refunds (assuming a separate Refund schema, adjust logic accordingly)
        const pendingRefunds = await Refund.countDocuments({ refundStatus: 'pending' }); // Placeholder, replace with actual query when Refund schema is available

        // Calculate total admins
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // Calculate total users
        const totalUsers = await User.countDocuments();

        // Respond with the aggregated stats
        res.send({
            totalBuses,
            busesOnRoute,
            totalDrivers,
            pendingRefunds,
            totalAdmins,
            totalUsers,
        });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};
