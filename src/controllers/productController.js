const productService = require('../services/productService');

const getProductList = async (req, res) => {
    try {
        const products = await productService.getProductList();
        return res.status(200).json({
            success: true,
            message: 'Product list fetched successfully.',
            products,
        });
    } catch (error) {
        console.error('Error fetching product list:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch product list.',
            details: error.message,
        });
    }
};

module.exports = {
    getProductList,
};