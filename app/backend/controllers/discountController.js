import Discount from '../models/discount.js';
import moment from 'moment';

// Add a Discount
export const addDiscount = async (req, res) => {
    try {
        const { code, percentage, validTill } = req.body;

        if (!code || !percentage || !validTill) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        if (percentage < 1 || percentage > 100) {
            return res.status(400).send({ message: 'Percentage must be between 1 and 100.' });
        }

        const discount = new Discount({
            code,
            percentage,
            validTill,
            createdBy: req.admin._id, // Assuming admin is authenticated
        });

        await discount.save();
        res.status(201).send({ message: 'Discount added successfully', discount });
    } catch (error) {
        handleError(res, error);
    }
};

// Get All Discounts
export const getDiscounts = async (req, res) => {
    try {
        const discounts = await Discount.find().populate('createdBy');

        // Check validity
        discounts.forEach(discount => {
            if (moment().isAfter(discount.validTill)) {
                discount.status = 'Expired';
                discount.save();
            }
        });

        res.send({ message: 'Discounts fetched successfully', discounts });
    } catch (error) {
        handleError(res, error);
    }
};

// Update Discount
export const updateDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, percentage, validTill } = req.body;

        const discount = await Discount.findByIdAndUpdate(
            id,
            { code, percentage, validTill },
            { new: true }
        );

        if (!discount) {
            return res.status(404).send({ message: 'Discount not found.' });
        }

        res.send({ message: 'Discount updated successfully', discount });
    } catch (error) {
        handleError(res, error);
    }
};

// Delete Discount
export const deleteDiscount = async (req, res) => {
    try {
        const { id } = req.params;

        const discount = await Discount.findByIdAndDelete(id);
        if (!discount) {
            return res.status(404).send({ message: 'Discount not found.' });
        }

        res.send({ message: 'Discount deleted successfully', discount });
    } catch (error) {
        handleError(res, error);
    }
};
