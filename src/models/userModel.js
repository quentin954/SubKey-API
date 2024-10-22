const db = require('../config/database');

const User = {
    getAll: async () => {
        try {
            const result = await db.query('SELECT * FROM users');
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = User;