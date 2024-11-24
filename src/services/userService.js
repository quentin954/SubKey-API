const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Key = require('../models/keyModel');
const UserProduct = require('../models/userProductModel');

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

        return newUser;
    } catch (error) {
        throw new Error('Error registering user: ' + error.message);
    }
};

module.exports = { registerUser };