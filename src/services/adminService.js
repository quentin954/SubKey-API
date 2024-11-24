const crypto = require('crypto');
const Key = require('../models/keyModel');
const Product = require('../models/productModel');
const Status = require('../models/statusModel');
const ProductStatus = require('../models/productStatusModel');

const createKey = async (productName, durationSeconds) => {
    try {
        const product = await Product.getProductByName(productName);
        if (!product) {
            throw new Error(`Product with name "${productName}" not found.`);
        }

        const productId = product.product_id;
        const productKey = crypto.randomBytes(16).toString('hex');

        const newKey = await Key.createKey({ productKey, productId, durationSeconds });
        return newKey;
    } catch (error) {
        throw new Error('Error creating key: ' + error.message);
    }
};

const createProduct = async (productName, statusName) => {
    try {
        const existingProduct = await Product.getProductByName(productName);
        if (existingProduct) {
            throw new Error(`Product with name "${productName}" already exists.`);
        }

        const status = await Status.getStatusByName(statusName);
        if (!status) {
            throw new Error(`Status with name "${statusName}" not found.`);
        }

        const statusId = status.status_id;

        const newProduct = await Product.createProduct({ productName, statusId });
        return newProduct;
    } catch (error) {
        throw new Error('Error creating product: ' + error.message);
    }
};

const createProductStatus = async ({ statusName, description, isActive }) => {
    try {
        const existingStatus = await ProductStatus.getStatusByName(statusName);
        if (existingStatus) {
            throw new Error(`Product status with name "${statusName}" already exists.`);
        }

        const newStatus = await ProductStatus.createProductStatus({ statusName, description, isActive });
        return newStatus;
    } catch (error) {
        throw new Error('Error creating product status: ' + error.message);
    }
};

module.exports = {
    createKey,
    createProduct,
    createProductStatus
};