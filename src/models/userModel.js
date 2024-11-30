const db = require('../config/database');

const User = {
    getByUsernameOrEmail: async (username, email) => {
        if (!username && !email) {
            throw new Error('At least one of username or email must be provided.');
        }

        const query = `
            SELECT * FROM users 
            WHERE username = $1 OR email = $2
            LIMIT 1;
        `;
        const values = [username || null, email || null];

        try {
            const result = await db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error fetching user by username/email: ${error.message}`, { username, email });
            throw new Error('Database query failed while fetching user.');
        }
    },

    getByUsername: async (username) => {
        const query = `SELECT * FROM users WHERE username = $1 LIMIT 1;`;
        try {
            const result = await db.query(query, [username]);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error fetching user by username: ${error.message}`);
            throw new Error('Database query failed while fetching user.');
        }
    },

    create: async ({ username, email, password }) => {
        if (!username || !email || !password) {
            throw new Error('Username, email, and password are required to create a user.');
        }

        const query = `
            INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING *;
        `;
        const values = [username, email, password];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(`Error creating user: ${error.message}`, { username, email });
            throw new Error('Database query failed while creating user.');
        }
    },

    getAllUsers: async () => {
        const query = `
            SELECT user_id, username, email, hardware_id, last_login, created_at
            FROM users;
        `;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error(`Error fetching all users: ${error.message}`);
            throw new Error('Database query failed while fetching all users.');
        }
    }
};

module.exports = User;