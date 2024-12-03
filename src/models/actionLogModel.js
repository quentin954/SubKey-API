const db = require('../config/database');

const ActionLog = {
    logAction: async ({ userId = null, action, details = null, ipAddress = null }) => {
        if (!action || typeof action !== 'string') {
            throw new Error('Invalid action provided.');
        }

        const query = `
            INSERT INTO action_logs (user_id, action, details, ip_address, created_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP);
        `;
        
        const values = [userId, action, details ? JSON.stringify(details) : null, ipAddress];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(`Error logging action:`, { userId, action, details, ipAddress, error: error.message });
            //throw new Error('Database query failed while logging action.');
        }
    },
};

module.exports = ActionLog;