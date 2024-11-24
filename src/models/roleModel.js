const db = require('../config/database');

const Role = {
    getRolesByUserId: async (userId) => {
        if (!userId || typeof userId !== 'number') {
            throw new Error('Invalid user ID provided.');
        }

        const query = `
            SELECT r.role_name, r.power
            FROM roles r
            JOIN user_roles ur ON r.role_id = ur.role_id
            WHERE ur.user_id = $1;
        `;

        try {
            const result = await db.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error(`Error fetching roles for user ${userId}: ${error.message}`);
            throw new Error('Database query failed while fetching roles.');
        }
    },
};

module.exports = Role;