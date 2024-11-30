const crypto = require('crypto');
const User = require('../models/userModel');
const Key = require('../models/keyModel');
const Product = require('../models/productModel');
const Status = require('../models/statusModel');
const ProductStatus = require('../models/productStatusModel');
const UserProduct = require('../models/userProductModel');
const UserBan = require('../models/userBanModel');

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

const pauseProduct = async (productName, statusName) => {
    try {
        const status = await ProductStatus.getStatusByName(statusName);
        if (!status || status.is_active) {
            throw new Error('Invalid statusName. The provided status must have is_active set to false.');
        }

        const product = await Product.getProductByName(productName);
        if (!product) {
            throw new Error(`Product with name "${productName}" not found.`);
        }

        await ProductStatus.updateProductStatus(product.product_id, status.status_id);

        await UserProduct.pauseAllUsersByProductId(product.product_id);

        return { message: `Product "${productName}" has been paused with status "${statusName}", and user subscriptions have been paused.` };
    } catch (error) {
        throw new Error('Error pausing product: ' + error.message);
    }
};

const resumeProduct = async (productName, statusName) => {
    try {
        const status = await ProductStatus.getStatusByName(statusName);
        if (!status || !status.is_active) {
            throw new Error('Invalid statusName. The provided status must have is_active set to true.');
        }

        const product = await Product.getProductByName(productName);
        if (!product) {
            throw new Error(`Product with name "${productName}" not found.`);
        }

        await ProductStatus.updateProductStatus(product.product_id, status.status_id);

        await UserProduct.resumeAllUsersByProductId(product.product_id);

        return { message: `Product "${productName}" has been resumed with status "${statusName}", and user subscriptions have been resumed.` };
    } catch (error) {
        throw new Error('Error resuming product: ' + error.message);
    }
};

const banKey = async (productKey) => {
    try {
        const key = await Key.getActiveKey(productKey);
        if (!key) {
            throw new Error(`Key "${productKey}" not found.`);
        }

        const keyId = key.key_id;

        const updatedKey = await Key.updateKeyBanStatus(keyId);
        
        return updatedKey;
    } catch (error) {
        throw new Error('Error banning key: ' + error.message);
    }
};

const banUser = async (username, bannedBy, banDurationInSeconds = 0, reason = null) => {
    try {
        if (!username || !bannedBy) {
            throw new Error('Missing required parameters: username, bannedBy.');
        }
        
        const user = await User.getByUsername(username);
        if (!user) {
            throw new Error(`User with username "${username}" not found.`);
        }

        const userId = user.user_id;

        const activeBan = await UserBan.getActiveBanByUserId(userId);
        if (activeBan) {
            throw new Error('This user is already banned or has an active ban.');
        }

        const banDetails = await UserBan.banUser({
            userId,
            bannedBy,
            banDurationInSeconds,
            reason
        });

        return banDetails;
    } catch (error) {
        throw new Error('Error banning user: ' + error.message);
    }
};

const unbanUser = async (username) => {
    try {
        const user = await User.getByUsername(username);
        if (!user) {
            throw new Error(`User with username "${username}" not found.`);
        }

        const userId = user.user_id;

        const activeBan = await UserBan.getActiveBanByUserId(userId);
        if (!activeBan) {
            throw new Error('No active ban found for this user.');
        }

        const unbannedUser = await UserBan.unbanUser(userId);
        return unbannedUser;
    } catch (error) {
        throw new Error('Error unbanning user: ' + error.message);
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