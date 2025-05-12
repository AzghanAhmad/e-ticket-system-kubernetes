import Notification from '../models/notification.js';

// Add Notification
export const addNotification = async (req, res) => {
    try {
        const { message, recipients, priority } = req.body;

        if (!message || !recipients || recipients.length === 0) {
            return res.status(400).send({ message: 'Message and recipients are required.' });
        }

        const notification = new Notification({ message, recipients, priority });
        await notification.save();

        res.status(201).send({ message: 'Notification sent successfully', notification });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get All Notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.send({ message: 'Notifications fetched successfully', notifications });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).send({ message: 'Notification not found.' });
        }

        res.send({ message: 'Notification deleted successfully', notification });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
