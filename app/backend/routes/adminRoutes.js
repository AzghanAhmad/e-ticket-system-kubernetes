import express from 'express';
import { getAllAdmins,updateAdmin,deleteAdmin,getAllBookings,getAllRefunds,approveRefund,getTotalBookings,addRefund} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeAdmin } from '../middleware/authorizeAdmin.js';
import { addFare, getFares, updateFare, deleteFare } from '../controllers/fareController.js';
import { addFeedback, getFeedback, respondFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import { addNotification, getNotifications, deleteNotification } from '../controllers/notificationController.js';
import { createBus, getBuses, updateBus, deleteBus, assignBusToRoute } from '../controllers/busController.js';
import { addDiscount, getDiscounts, updateDiscount, deleteDiscount } from '../controllers/discountController.js';
import { addDriver, getDrivers, updateDriver, deleteDriver } from '../controllers/driverController.js';
import { createRoute, getRoutes, updateRoute, deleteRoute } from '../controllers/routeController.js';
import { addSchedule, getSchedules, updateSchedule, deleteSchedule } from '../controllers/scheduleController.js';
import { addTicket, getTickets, updateTicket, deleteTicket } from '../controllers/ticketController.js';
import { addTransaction, getTransactions, updateTransaction, deleteTransaction } from '../controllers/transactionController.js';
import { getStats } from '../controllers/statsController.js';

const router = express.Router();


// Admin Management
router.get('/admins', authenticateToken,authorizeAdmin, getAllAdmins);
router.put('/admins/:id', authenticateToken,authorizeAdmin, updateAdmin);
router.delete('/admins/:id', authenticateToken,authorizeAdmin, deleteAdmin);
router.get('/admin/refunds',getAllRefunds);
router.get('/admin/bookings',getAllBookings);
router.get('/admin/refunds/:refundId/approve',approveRefund);
router.post("/admin/refunds/add", addRefund);
router.get('/admin//bookings/total',getTotalBookings);

// Fare Routes
router.post('/fares', addFare);
router.get('/fares', getFares);
router.put('/fares/:id', updateFare);
router.delete('/fares/:id', deleteFare);

// Feedback Routes
router.post('/feedback', addFeedback);
router.get('/feedback', getFeedback);
router.put('/feedback/:id/respond', respondFeedback);
router.delete('/feedback/:id', deleteFeedback);

// Notification Routes
router.post('/notifications', addNotification);
router.get('/notifications', getNotifications);
router.delete('/notifications/:id', deleteNotification);

// Bus Routes
router.post('/buses', createBus);
router.get('/buses', getBuses);
router.put('/buses/:id', updateBus);
router.delete('/buses/:id', deleteBus);
router.post('/buses/assign', assignBusToRoute);

// Discount Routes
router.post('/discounts', addDiscount);
router.get('/discounts', getDiscounts);
router.put('/discounts/:id', updateDiscount);
router.delete('/discounts/:id', deleteDiscount);

// Driver Routes
router.post('/drivers', addDriver);
router.get('/drivers', getDrivers);
router.put('/drivers/:id', updateDriver);
router.delete('/drivers/:id', deleteDriver);

// Route Routes
router.post('/routes', createRoute);
router.get('/routes', getRoutes);
router.put('/routes/:id', updateRoute);
router.delete('/routes/:id', deleteRoute);

// Schedule Routes
router.post('/schedules', addSchedule);
router.get('/schedules', getSchedules);
router.put('/schedules/:id', updateSchedule);
router.delete('/schedules/:id', deleteSchedule);

// Ticket Routes
router.post('/tickets', addTicket);
router.get('/tickets', getTickets);
router.put('/tickets/:id', updateTicket);
router.delete('/tickets/:id', deleteTicket);

// Transaction Routes
router.post('/transactions', addTransaction);
router.get('/transactions', getTransactions);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);

//check stats
router.get('/stats', getStats);

export default router;
