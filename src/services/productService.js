const Product = require('../models/productModel');

const getProductList = async () => {
    try {
        const products = await Product.getAllProductsWithStatus();
        return products;
    } catch (error) {
        throw new Error('Error fetching product list: ' + error.message);
    }
};

module.exports = {
    getProductList,
};