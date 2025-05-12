import Ticket from '../models/ticket.js';

// Add Ticket
export const addTicket = async (req, res) => {
    try {
        const { booking, seatNumber, passengerName, price } = req.body;

        if (!booking || !seatNumber || !passengerName || !price) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        const ticket = new Ticket({ booking, seatNumber, passengerName, price });
        await ticket.save();

        res.status(201).send({ message: 'Ticket added successfully', ticket });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get All Tickets
export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('booking');
        res.send({ message: 'Tickets fetched successfully', tickets });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update Ticket
export const updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { seatNumber, passengerName, price } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(
            id,
            { seatNumber, passengerName, price },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).send({ message: 'Ticket not found.' });
        }

        res.send({ message: 'Ticket updated successfully', ticket });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete Ticket
export const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await Ticket.findByIdAndDelete(id);
        if (!ticket) {
            return res.status(404).send({ message: 'Ticket not found.' });
        }

        res.send({ message: 'Ticket deleted successfully', ticket });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
