import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import Refund from '../models/refund.js';
import Booking from '../models/booking.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

// Utility for error handling
const handleError = (res, error, status = 500) => {
    res.status(status).send({ message: error.message || 'Server Error' });
};

// Get all admins
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find().select('-password');
        res.send(admins);
    } catch (error) {
        handleError(res, error);
    }
};

// Update admin
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedAdmin = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).select('-password');

        if (!updatedAdmin) {
            return res.status(404).send({ message: 'Admin not found.' });
        }

        res.send({ message: 'Admin updated successfully.', admin: updatedAdmin });
    } catch (error) {
        handleError(res, error);
    }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAdmin = await User.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return res.status(404).send({ message: 'Admin not found.' });
        }

        res.send({ message: 'Admin deleted successfully.' });
    } catch (error) {
        handleError(res, error);
    }
};

const resetTokens = new Map();

// Request Password Reset
export const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email exists
        const admin = await User.findOne({ email });
        if (!admin) {
            return res.status(404).send({ message: 'Admin with this email does not exist.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Store token with an expiry time of 15 minutes
        resetTokens.set(resetToken, { adminId: admin._id, expires: Date.now() + 15 * 60 * 1000 });

        // Send reset link via email (Using nodemailer for demonstration)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.EMAIL_PASSWORD, // Your email password
            },
        });

        const resetLink = `${req.protocol}://${req.get('host')}/admin/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset Request',
            text: `Click on the following link to reset your password: ${resetLink}. This link is valid for 15 minutes.`,
        });

        res.status(200).send({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        handleError(res, error);
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).send({ message: 'Password must be at least 8 characters long.' });
        }

        // Check if the token exists and is valid
        const resetData = resetTokens.get(token);
        if (!resetData || resetData.expires < Date.now()) {
            return res.status(400).send({ message: 'Invalid or expired token.' });
        }

        // Fetch the admin from the database
        const admin = await User.findById(resetData.adminId);
        if (!admin) {
            return res.status(404).send({ message: 'Admin not found.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update admin's password
        admin.password = hashedPassword;
        await admin.save();

        // Invalidate the token
        resetTokens.delete(token);

        res.status(200).send({ message: 'Password has been reset successfully.' });
    } catch (error) {
        handleError(res, error);
    }
};

export const getAllRefunds = async (req, res) => {
    try {
        const refunds = await Refund.find().populate("booking", "customerName customerEmail");
        res.status(200).json(refunds);
    } catch (error) {
        console.error("Error fetching refunds:", error);
        res.status(500).json({ message: "Failed to fetch refunds." });
    }
};

export const approveRefund = async (req, res) => {
    const { refundId } = req.params;

    // Log the refundId to debug
    console.log("Refund ID received:", refundId);

    // Check if the refundId is valid
    if (!mongoose.Types.ObjectId.isValid(refundId)) {
        return res.status(400).json({ message: "Invalid refund ID format." });
    }

    try {
        // Log database lookup
        console.log(`Looking for refund with ID: ${refundId}`);
        const refund = await Refund.findById(refundId);

        if (!refund) {
            return res.status(404).json({ message: "Refund not found." });
        }

        if (refund.refundStatus !== "pending") {
            return res.status(400).json({ message: "Only pending refunds can be approved." });
        }

        refund.refundStatus = "approved";
        refund.processedDate = new Date();
        await refund.save();

        res.status(200).json({ message: "Refund approved successfully.", refund });
    } catch (error) {
        console.error("Error approving refund:", error);
        res.status(500).json({ message: "Failed to approve refund." });
    }
};



export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Failed to fetch bookings." });
    }
};

export const getTotalBookings = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        res.status(200).json({ totalBookings });
    } catch (error) {
        console.error("Error fetching total bookings:", error);
        res.status(500).json({ message: "Failed to fetch total bookings." });
    }
};

export const addRefund = async (req, res) => {
    const { customerName, refundAmount, reason, bookingId } = req.body;

    // Validate the input data
    if (!customerName || !refundAmount || !reason || !bookingId) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Create a new refund instance
        const newRefund = new Refund({
            customerName,
            refundAmount,
            reason,
            booking: bookingId,  // Pass the bookingId to the booking field
            refundStatus: "pending", // Default status for new refunds
            requestDate: new Date(),
        });

        // Save the refund to the database
        await newRefund.save();

        res.status(201).json({ message: "Refund added successfully.", refund: newRefund });
    } catch (error) {
        console.error("Error adding refund:", error);
        res.status(500).json({ message: "Failed to add refund." });
    }
};