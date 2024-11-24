const db = require('../config/database');

const UserProduct = {
    activateSubscription: async ({ userId, productId, keyId, expiryDate }) => {
        // Validate input arguments
        if (!userId || !productId || !keyId || !expiryDate) {
            throw new Error('Missing required parameters: userId, productId, keyId, expiryDate.');
        }

        const query = `
            INSERT INTO user_products (user_id, product_id, key_id, activation_date, expiry_date) 
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4) 
            RETURNING *;
        `;
        const values = [userId, productId, keyId, expiryDate];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error activating subscription:', {
                userId,
                productId,
                keyId,
                expiryDate,
                error: error.message,
            });
            throw new Error('Database query failed while activating subscription.');
        }
    },
};

module.exports = UserProduct;