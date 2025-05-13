import Fare from '../models/fare.js';

// Add a Fare
export const addFare = async (req, res) => {
    try {
        const { route, baseFare, additionalFarePerStop } = req.body;

        if (!route || !baseFare) {
            return res.status(400).send({ message: 'Route and base fare are required.' });
        }

        const fare = new Fare({ route, baseFare, additionalFarePerStop });
        await fare.save();

        res.status(201).send({ message: 'Fare added successfully', fare });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get All Fares
export const getFares = async (req, res) => {
    try {
        const fares = await Fare.find()
            .populate("route") // Populate route details
            .select("route baseFare additionalFarePerStop createdAt updatedAt");
        res.send({ message: 'Fares fetched successfully', fares });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update Fare
export const updateFare = async (req, res) => {
    try {
        const { id } = req.params;
        const { baseFare, additionalFarePerStop } = req.body;

        const fare = await Fare.findByIdAndUpdate(
            id,
            { baseFare, additionalFarePerStop },
            { new: true }
        );

        if (!fare) {
            return res.status(404).send({ message: 'Fare not found.' });
        }

        res.send({ message: 'Fare updated successfully', fare });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Delete Fare
export const deleteFare = async (req, res) => {
    try {
        const { id } = req.params;

        const fare = await Fare.findByIdAndDelete(id);
        if (!fare) {
            return res.status(404).send({ message: 'Fare not found.' });
        }

        res.send({ message: 'Fare deleted successfully', fare });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
