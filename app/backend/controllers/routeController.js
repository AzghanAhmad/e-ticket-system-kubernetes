import Route from '../models/routes.js';

export const createRoute = async (req, res) => {
    try {
        const { start, end, stops, distance, estimatedDuration } = req.body;

        const route = new Route({ start, end, stops, distance, estimatedDuration });
        await route.save();
        res.status(201).send({ message: 'Route created successfully.', route });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};

export const getRoutes = async (req, res) => {
    try {
        const routes = await Route.find().populate('start end buses');
        res.send(routes);
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};

export const updateRoute = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedRoute = await Route.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedRoute) {
            return res.status(404).send({ message: 'Route not found.' });
        }

        res.send({ message: 'Route updated successfully.', route: updatedRoute });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};

export const deleteRoute = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRoute = await Route.findByIdAndDelete(id);
        if (!deletedRoute) {
            return res.status(404).send({ message: 'Route not found.' });
        }

        res.send({ message: 'Route deleted successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};
