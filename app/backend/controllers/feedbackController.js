import Feedback from '../models/feedback.js';

// Add Feedback
export const addFeedback = async (req, res) => {
    try {
        const { customerEmail, message } = req.body;

        if (!customerEmail || !message) {
            return res.status(400).send({ message: 'Email and message are required.' });
        }

        const feedback = new Feedback({ customerEmail, message });
        await feedback.save();

        res.status(201).send({ message: 'Feedback submitted successfully', feedback });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get All Feedback
export const getFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.send({ message: 'Feedback fetched successfully', feedbacks });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Respond to Feedback
export const respondFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { response, status: 'Reviewed' },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).send({ message: 'Feedback not found.' });
        }

        res.send({ message: 'Feedback responded successfully', feedback });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete Feedback
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);
        if (!feedback) {
            return res.status(404).send({ message: 'Feedback not found.' });
        }

        res.send({ message: 'Feedback deleted successfully', feedback });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
