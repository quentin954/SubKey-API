const db = require('../config/database');

const ProductStatus = {
    createProductStatus: async ({ statusName, description, isActive }) => {
        const query = `
            INSERT INTO product_status (status_name, description, is_active)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [statusName, description, isActive];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(`Error creating product status: ${error.message}`, { statusName, description, isActive });
            throw new Error('Database query failed while creating product status.');
        }
    },

    getStatusByName: async (statusName) => {
        const query = `SELECT * FROM product_status WHERE status_name = $1 LIMIT 1;`;
        
        try {
            const result = await db.query(query, [statusName]);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error fetching product status by name: ${error.message}`, { statusName });
            throw new Error('Database query failed while fetching product status by name.');
        }
    }
};

module.exports = ProductStatus;