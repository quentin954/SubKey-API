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

    getRoleByName: async (roleName) => {
        if (!roleName || typeof roleName !== 'string') {
            throw new Error('Invalid role name provided.');
        }

        const query = `
            SELECT role_id, role_name, power
            FROM roles
            WHERE role_name = $1;
        `;

        try {
            const result = await db.query(query, [roleName]);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error fetching role by name "${roleName}": ${error.message}`);
            throw new Error('Database query failed while fetching role by name.');
        }
    },

    createRole: async (roleName, power) => {
        if (!roleName || typeof roleName !== 'string') {
            throw new Error('Invalid role name provided.');
        }

        if (power === undefined || typeof power !== 'number') {
            throw new Error('Invalid power value provided.');
        }

        const query = `
            INSERT INTO roles (role_name, power)
            VALUES ($1, $2)
            RETURNING role_id, role_name, power;
        `;

        try {
            const result = await db.query(query, [roleName, power]);
            return result.rows[0];
        } catch (error) {
            console.error(`Error creating role "${roleName}": ${error.message}`);
            throw new Error('Database query failed while creating role.');
        }
    },
};

module.exports = Role;