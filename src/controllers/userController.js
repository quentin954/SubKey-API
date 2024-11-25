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

        const token = await userService.registerUser({ username, password, email, subscriptionKey });

        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to register user.',
            details: error.message
        });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Username and password are required.',
        });
    }

    try {
        const token = await userService.loginUser(username, password);

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid username or password.',
            details: error.message,
        });
    }
};

const subscriptions = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const subscriptions = await userService.getUserSubscriptions(userId);

        if (!subscriptions.length) {
            return res.status(404).json({
                success: false,
                message: 'No active subscriptions found for the user.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'User subscriptions retrieved successfully.',
            subscriptions,
        });
    } catch (error) {
        console.error('Error fetching subscriptions:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve subscriptions.',
            details: error.message,
        });
    }
};

const activateKey = async (req, res) => {
    const { subscriptionKey } = req.body;

    if (!subscriptionKey) {
        return res.status(400).json({
            success: false,
            message: 'Subscription key is required.',
        });
    }

    try {
        const userId = req.user.user_id;
        const result = await userService.activateKey(userId, subscriptionKey);

        res.status(200).json({
            success: true,
            message: 'Subscription key activated successfully.',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to activate subscription key.',
            details: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    subscriptions,
    activateKey,
};