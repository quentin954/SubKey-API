const User = require('../models/userModel');

const getAllUsers = async () => {
    try {
        const users = await User.getAll();
        return users;
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
};

module.exports = { getAllUsers };