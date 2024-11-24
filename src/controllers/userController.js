const userService = require('../services/userService');

const register = async (req, res) => {
    const { username, password, email, subscriptionKey } = req.body;

    try {
        if (!username || !password || !email || !subscriptionKey) {
            return res.status(400).json({
                success: false,
                message: 'All fields (username, password, email, subscriptionKey) are required.'
            });
        }

        const result = await userService.registerUser({ username, password, email, subscriptionKey });

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            user: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to register user.',
            details: error.message
        });
    }
};

module.exports = {
    register
};