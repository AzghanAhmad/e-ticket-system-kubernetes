import Transaction from '../models/transaction.js';

// Add Transaction
export const addTransaction = async (req, res) => {
    try {
        const { type, amount, description, associatedId } = req.body;

        if (!type || !amount || !description) {
            return res.status(400).send({ message: 'Type, amount, and description are required.' });
        }

        const transaction = new Transaction({ type, amount, description, associatedId });
        await transaction.save();

        res.status(201).send({ message: 'Transaction recorded successfully', transaction });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get All Transactions
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.send({ message: 'Transactions fetched successfully', transactions });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update Transaction
export const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description } = req.body;

        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { amount, description },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).send({ message: 'Transaction not found.' });
        }

        res.send({ message: 'Transaction updated successfully', transaction });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete Transaction
export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findByIdAndDelete(id);
        if (!transaction) {
            return res.status(404).send({ message: 'Transaction not found.' });
        }

        res.send({ message: 'Transaction deleted successfully', transaction });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
