import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    refundAmount: { type: Number, required: true },
    refundStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reason: { type: String },
    requestDate: { type: Date, default: Date.now },
    processedDate: { type: Date },
});

export default mongoose.model('Refund', refundSchema);
