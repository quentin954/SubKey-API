const db = require('../config/database');

const UserRole = {
    assignRole: async (userId, roleId) => {
        if (!userId || !roleId || typeof userId !== 'number' || typeof roleId !== 'number') {
            throw new Error('Invalid userId or roleId provided.');
        }

        const query = `
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, role_id) DO NOTHING;
        `;

        try {
            const result = await db.query(query, [userId, roleId]);
            return result.rowCount > 0;
        } catch (error) {
            console.error(`Error assigning role ${roleId} to user ${userId}: ${error.message}`);
            throw new Error('Database query failed while assigning role.');
        }
    },
};

module.exports = UserRole;