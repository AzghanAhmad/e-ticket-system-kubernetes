import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
    seatsBooked: { type: Number, required: true },
    totalFare: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "pending" },
});

export default mongoose.model('Booking', bookingSchema);
