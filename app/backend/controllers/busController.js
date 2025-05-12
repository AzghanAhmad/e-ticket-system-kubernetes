import Route from '../models/routes.js';
import Bus from '../models/bus.js';

export const createBus = async (req, res) => {
    try {
        const { licensePlate, capacity, type, driver, status, features } = req.body;

        const existingBus = await Bus.findOne({ licensePlate });
        if (existingBus) {
            return res.status(400).send({ message: 'Bus with this license plate already exists.' });
        }

        const bus = new Bus({ licensePlate, capacity, type, driver, status, features });
        await bus.save();
        res.status(201).send({ message: 'Bus created successfully.', bus });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};


export const getBuses = async (req, res) => {
    try {
        // Fetch all buses with their associated driver and route details
        const buses = await Bus.find().populate('licensePlate driver assignedRoute type') .populate("driver", "name contactNumber") // Populate driver info
        .populate("assignedRoute", "name");

        // Count total buses
        const totalBuses = buses.length;

        // Count buses that are assigned to a route
        const busesOnRoutes = buses.filter(bus => bus.assignedRoute).length;

        // Count available buses (status: Active but not assigned to a route)
        const availableBuses = buses.filter(
            bus => bus.status === 'Active' && !bus.assignedRoute
        ).length;

        res.send({
            totalBuses,
            busesOnRoutes,
            availableBuses,
            buses, // Detailed data about all buses
        });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};


export const updateBus = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedBus = await Bus.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedBus) {
            return res.status(404).send({ message: 'Bus not found.' });
        }

        res.send({ message: 'Bus updated successfully.', bus: updatedBus });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};

export const deleteBus = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBus = await Bus.findByIdAndDelete(id);

        if (!deletedBus) {
            return res.status(404).send({ message: 'Bus not found.' });
        }

        res.send({ message: 'Bus deleted successfully.' });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};

export const assignBusToRoute = async (req, res) => {
    try {
        const { busId, routeId } = req.body;

        const bus = await Bus.findById(busId);
        const route = await Route.findById(routeId);

        if (!bus || !route) {
            return res.status(404).send({ message: 'Bus or Route not found.' });
        }

        bus.assignedRoute = routeId;
        route.buses.push(busId);

        await bus.save();
        await route.save();

        res.send({ message: 'Bus assigned to route successfully.', bus });
    } catch (error) {
        res.status(500).send({ message: error.message || 'Server Error' });
    }
};
