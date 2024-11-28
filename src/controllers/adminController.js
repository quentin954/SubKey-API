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
        const result = await ProductService.pauseProduct(productName, statusName);
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

module.exports = {
    createKey,
    createProduct,
    createProductStatus,
    pauseProduct,
    resumeProduct
};