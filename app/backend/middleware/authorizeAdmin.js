// Middleware to authorize only admins
export const authorizeAdmin = async (req, res, next) => {
    try {
        // Ensure user data is attached to the request
        if (!req.user) {
            return res.status(401).send({ message: 'Unauthorized access.' });
        }

        // Check the user's role
        if (req.user.role !== 'admin') {
            return res.status(403).send({ message: 'Access forbidden: Admins only.' });
        }

        next(); // Proceed if the user is an admin
    } catch (error) {
        res.status(500).send({ message: 'An error occurred during authorization.' });
    }
};