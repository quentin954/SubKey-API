const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Key = require('../models/keyModel');
const UserProduct = require('../models/userProductModel');
const { generateToken } = require('../utils/jwtHelper');
const { addDurationToDate } = require('../utils/dateUtils');

const registerUser = async ({ username, password, email, subscriptionKey }) => {
    try {
        const existingUser = await User.getByUsernameOrEmail(username, email);
        if (existingUser) {
            throw new Error('Username or email already in use.');
        }

        const key = await Key.getActiveKey(subscriptionKey);
        if (!key) {
            throw new Error('Invalid or inactive subscription key.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, email, password: hashedPassword });

        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + key.duration_seconds);
        await UserProduct.activateSubscription({
            userId: newUser.user_id,
            productId: key.product_id,
            keyId: key.key_id,
            expiryDate,
        });

        await Key.deactivateKey(key.key_id);

        const token = generateToken(
            {
                user_id: newUser.user_id,
                username: newUser.username
            },
            '1h'
        );

        return token;
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
};

const loginUser = async (username, password) => {
    try {
        const user = await User.getByUsername(username);
        if (!user) {
            throw new Error('Invalid username or password.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid username or password.');
        }

        const token = generateToken(
            {
                user_id: user.user_id,
                username: user.username,
            },
            '1h'
        );

        return token;
    } catch (error) {
        throw new Error('Authentication failed: ' + error.message);
    }
};

const getUserSubscriptions = async (userId) => {
    try {
        const subscriptions = await UserProduct.getUserSubscriptions(userId);
        return subscriptions;
    } catch (error) {
        throw new Error('Error retrieving user subscriptions: ' + error.message);
    }
};

const activateKey = async (userId, subscriptionKey) => {
    try {
        const key = await Key.getActiveKey(subscriptionKey);
        if (!key) {
            throw new Error("Invalid or inactive subscription key.");
        }

        const existingSubscription = await UserProduct.getSubscription(userId, key.product_id);

        let newExpiryDate;
        const now = new Date();

        if (existingSubscription) {
            const currentExpiry = new Date(existingSubscription.expiry_date);

            if (currentExpiry > now) {
                newExpiryDate = addDurationToDate(currentExpiry, key.duration_seconds);
            } else {
                newExpiryDate = addDurationToDate(now, key.duration_seconds);
            }

            await UserProduct.updateSubscriptionExpiry(userId, key.product_id, newExpiryDate);
        } else {
            newExpiryDate = addDurationToDate(now, key.duration_seconds);
            await UserProduct.activateSubscription({
                userId,
                productId: key.product_id,
                keyId: key.key_id,
                expiryDate: newExpiryDate,
            });
        }

        await Key.deactivateKey(key.key_id);

        return { productId: key.product_id, expiryDate: newExpiryDate };
    } catch (error) {
        throw new Error("Error activating subscription key: " + error.message);
    }
};

module.exports = { registerUser, loginUser, getUserSubscriptions, activateKey };