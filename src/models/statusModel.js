const db = require('../config/database');

const Status = {
    getStatusByName: async (statusName) => {
        try {
            const query = `SELECT * FROM product_status WHERE status_name = $1 LIMIT 1;`;
            const result = await db.query(query, [statusName]);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error retrieving status by name: ${error.message}`, { statusName });
            throw new Error('Database query failed while retrieving status by name.');
        }
    },
};

module.exports = Status;