const adminService = require('../services/adminService');

const createKey = async (req, res) => {
    const { productName, durationSeconds } = req.body;

    if (!productName || !durationSeconds) {
        return res.status(400).json({
            success: false,
            message: 'Both productName and durationSeconds are required.'
        });
    }

    try {
        const key = await adminService.createKey(productName, durationSeconds);
        res.status(201).json({ success: true, key });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createProduct = async (req, res) => {
    const { productName, statusName } = req.body;

    if (!productName || !statusName) {
        return res.status(400).json({
            success: false,
            message: 'Both productName and statusName are required.'
        });
    }

    try {
        const product = await adminService.createProduct(productName, statusName);

        res.status(201).json({
            success: true,
            message: 'Product created successfully!',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product.',
            details: error.message
        });
    }
};

const createProductStatus = async (req, res) => {
    const { statusName, description, isActive } = req.body;

    if (!statusName || typeof statusName !== 'string' || !isActive) {
        return res.status(400).json({
            success: false,
            message: 'Both statusName and isActive are required. statusName must be a string.'
        });
    }

    try {
        const productStatus = await adminService.createProductStatus({ statusName, description, isActive });

        res.status(201).json({
            success: true,
            message: 'Product status created successfully!',
            productStatus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create product status.',
            details: error.message
        });
    }
};

const pauseProduct = async (req, res) => {
    const { productName, statusName } = req.body;

    if (!productName || !statusName) {
        return res.status(400).json({ success: false, message: 'productName and statusName are required.' });
    }

    try {
        const result = await adminService.pauseProduct(productName, statusName);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        console.error('Error pausing product:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to pause product.',
            details: error.message
        });
    }
};

const resumeProduct = async (req, res) => {
    const { productName, statusName } = req.body;

    if (!productName || !statusName) {
        return res.status(400).json({ success: false, message: 'productName and statusName are required.' });
    }

    try {
        const result = await adminService.resumeProduct(productName, statusName);
        return res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        console.error('Error resuming product:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to resume product.',
            details: error.message
        });
    }
};

const banKey = async (req, res) => {
    const { productKey } = req.body;

    if (!productKey) {
        return res.status(400).json({
            success: false,
            message: 'Product key is required.'
        });
    }

    try {
        const result = await adminService.banKey(productKey);
        
        res.status(200).json({
            success: true,
            message: `Key "${productKey}" has been banned successfully.`,
            result
        });
    } catch (error) {
        console.error('Error banning key:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to ban the key.',
            details: error.message
        });
    }
};

const banUser = async (req, res) => {
    const { username, banDurationInSeconds = 0, reason = null } = req.body;

    if (!username) {
        return res.status(400).json({
            success: false,
            message: 'The username is required.'
        });
    }

    try {
        const bannedBy = req.user.user_id;
        
        const banDetails = await adminService.banUser(username, bannedBy, banDurationInSeconds, reason);
        
        return res.status(200).json({
            success: true,
            message: `User with username "${username}" has been banned successfully.`,
            banDetails
        });
    } catch (error) {
        console.error('Error banning user:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to ban the user.',
            details: error.message
        });
    }
};

const unbanUser = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({
            success: false,
            message: 'Username is required.',
        });
    }

    try {
        const unbannedUser = await adminService.unbanUser(username);
        
        return res.status(200).json({
            success: true,
            message: `User with username "${username}" has been unbanned successfully.`,
            unbannedUser,
        });
    } catch (error) {
        console.error('Error unbanning user:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to unban user.',
            details: error.message,
        });
    }
};

module.exports = {
    createKey,
    createProduct,
    createProductStatus,
    pauseProduct,
    resumeProduct,
    banKey,
    banUser,
    unbanUser
};