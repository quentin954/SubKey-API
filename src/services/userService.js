const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Key = require('../models/keyModel');
const UserProduct = require('../models/userProductModel');
const UserBan = require('../models/userBanModel');
const ActionLog = require('../models/actionLogModel');
const { generateToken } = require('../utils/jwtHelper');
const { addDurationToDate } = require('../utils/dateUtils');
const { getContext } = require('../utils/contextUtils');

const registerUser = async ({ username, password, email, subscriptionKey }) => {
    try {
        const existingUser = await User.getByUsernameOrEmail(username, email);
        if (existingUser) {
            await ActionLog.logAction({
                action: 'FAILED_REGISTER_USER',
                details: { username, email, subscriptionKey, reason: 'Username or email already in use' },
                ipAddress: getContext('ipAddress'),
            });
            throw new Error('Username or email already in use.');
        }

        const key = await Key.getActiveKey(subscriptionKey);
        if (!key) {
            await ActionLog.logAction({
                action: 'FAILED_REGISTER_USER',
                details: { username, email, subscriptionKey, reason: 'Invalid or inactive subscription key' },
                ipAddress: getContext('ipAddress'),
            });
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

        await ActionLog.logAction({
            userId: newUser.user_id,
            action: 'REGISTER_USER',
            details: { username, email, subscriptionKey, token, expiryDate },
            ipAddress: getContext('ipAddress'),
        });

        return token;
    } catch (error) {
        await ActionLog.logAction({
            action: 'FAILED_REGISTER_USER',
            details: { username, email, subscriptionKey, error: error.message },
            ipAddress: getContext('ipAddress'),
        });
        throw new Error('Error registering user: ' + error.message);
    }
};

const loginUser = async (username, password) => {
    try {
        const user = await User.getByUsername(username);
        if (!user) {
            await ActionLog.logAction({
                action: 'FAILED_LOGIN_USER',
                details: { username, reason: 'Invalid username' },
                ipAddress: getContext('ipAddress'),
            });
            throw new Error('Invalid username or password.');
        }

        const activeBan = await UserBan.getActiveBanByUserId(user.user_id);
        if (activeBan) {
            const banMessage = activeBan.reason ? `You are banned from the platform. Reason: ${activeBan.reason}` : 'You are banned from the platform.';
            await ActionLog.logAction({
                userId: user.user_id,
                action: 'FAILED_LOGIN_USER',
                details: { username, reason: banMessage },
                ipAddress: getContext('ipAddress'),
            });
            throw new Error(banMessage);
        }        

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await ActionLog.logAction({
                userId: user.user_id,
                action: 'FAILED_LOGIN_USER',
                details: { username, reason: 'Invalid password' },
                ipAddress: getContext('ipAddress'),
            });
            throw new Error('Invalid username or password.');
        }

        const token = generateToken(
            {
                user_id: user.user_id,
                username: user.username,
            },
            '1h'
        );

        await ActionLog.logAction({
            userId: user.user_id,
            action: 'LOGIN_USER',
            details: { username },
            ipAddress: getContext('ipAddress'),
        });

        return token;
    } catch (error) {
        await ActionLog.logAction({
            action: 'FAILED_LOGIN_USER',
            details: { username, error: error.message },
            ipAddress: getContext('ipAddress'),
        });
        throw new Error('Authentication failed: ' + error.message);
    }
};

const getUserSubscriptions = async (userId) => {
    try {
        const subscriptions = await UserProduct.getUserSubscriptions(userId);

        await ActionLog.logAction({
            userId,
            action: 'GET_USER_SUBSCRIPTIONS',
            details: { subscriptions },
            ipAddress: getContext('ipAddress'),
        });

        return subscriptions;
    } catch (error) {
        await ActionLog.logAction({
            userId,
            action: 'FAILED_GET_USER_SUBSCRIPTIONS',
            details: { error: error.message },
            ipAddress: getContext('ipAddress'),
        });
        throw new Error('Error retrieving user subscriptions: ' + error.message);
    }
};

const activateKey = async (userId, subscriptionKey) => {
    try {
        const key = await Key.getActiveKey(subscriptionKey);
        if (!key) {
            await ActionLog.logAction({
                userId,
                action: 'FAILED_ACTIVATE_KEY',
                details: { subscriptionKey, reason: "Invalid or inactive key" },
                ipAddress: getContext('ipAddress'),
            });
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

        await ActionLog.logAction({
            userId,
            action: 'ACTIVATE_KEY',
            details: {
                subscriptionKey,
                productId: key.product_id,
                expiryDate: newExpiryDate,
            },
            ipAddress: getContext('ipAddress'),
        });

        return { productId: key.product_id, expiryDate: newExpiryDate };
    } catch (error) {
        await ActionLog.logAction({
            userId,
            action: 'FAILED_ACTIVATE_KEY',
            details: { subscriptionKey, error: error.message },
            ipAddress: getContext('ipAddress'),
        });
        throw new Error("Error activating subscription key: " + error.message);
    }
};

module.exports = { registerUser, loginUser, getUserSubscriptions, activateKey };