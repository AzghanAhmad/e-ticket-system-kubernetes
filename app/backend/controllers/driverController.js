import Driver from '../models/driver.js';
import Bus from '../models/bus.js';

// Utility for error handling
const handleError = (res, error, status = 500) => {
    res.status(status).send({ message: error.message || 'Server Error' });
};

// Add a Driver
export const addDriver = async (req, res) => {
    try {
        const { name, contactNumber, licenseNumber, experienceYears } = req.body;

        // Validate fields
        if (!name || !contactNumber || !licenseNumber) {
            return res.status(400).send({ message: 'All fields are required.' });
        }

        // Check for existing driver with same license
        const existingDriver = await Driver.findOne({ licenseNumber });
        if (existingDriver) {
            return res.status(400).send({ message: 'Driver with this license already exists.' });
        }

        const driver = new Driver({ name, contactNumber, licenseNumber, experienceYears });
        await driver.save();

        res.status(201).send({ message: 'Driver added successfully', driver });
    } catch (error) {
        handleError(res, error);
    }
};

// Get All Drivers
export const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().populate('assignedBus');
        res.send({ message: 'Drivers fetched successfully', drivers });
    } catch (error) {
        handleError(res, error);
    }
};

// Update Driver
export const updateDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contactNumber, licenseNumber, experienceYears, status } = req.body;

        const driver = await Driver.findByIdAndUpdate(
            id,
            { name, contactNumber, licenseNumber, experienceYears, status },
            { new: true }
        );

        if (!driver) {
            return res.status(404).send({ message: 'Driver not found.' });
        }

        res.send({ message: 'Driver updated successfully', driver });
    } catch (error) {
        handleError(res, error);
    }
};

// Delete Driver
export const deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const driver = await Driver.findByIdAndDelete(id);
        if (!driver) {
            return res.status(404).send({ message: 'Driver not found.' });
        }

        res.send({ message: 'Driver deleted successfully', driver });
    } catch (error) {
        handleError(res, error);
    }
};
