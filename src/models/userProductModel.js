const db = require('../config/database');

const UserProduct = {
    activateSubscription: async ({ userId, productId, keyId, expiryDate }) => {
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

    getUserSubscriptions: async (userId) => {
        const query = `
            SELECT 
                up.user_product_id,
                p.product_name,
                k.product_key,
                up.activation_date,
                up.expiry_date,
                up.is_paused,
                up.paused_at
            FROM user_products up
            JOIN products p ON up.product_id = p.product_id
            JOIN keys k ON up.key_id = k.key_id
            WHERE up.user_id = $1;
        `;
        const values = [userId];

        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error(`Error fetching subscriptions for user ID ${userId}:`, error.message);
            throw new Error('Database query failed while fetching user subscriptions.');
        }
    },

    getSubscription: async (userId, productId) => {
        const query = `
            SELECT * FROM user_products 
            WHERE user_id = $1 AND product_id = $2 
            LIMIT 1;
        `;
        const values = [userId, productId];

        try {
            const result = await db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error fetching subscription for user ID ${userId} and product ID ${productId}:`, error.message);
            throw new Error('Database query failed while fetching subscription.');
        }
    },

    updateSubscriptionExpiry: async (userId, productId, newExpiryDate) => {
        const query = `
            UPDATE user_products 
            SET expiry_date = $1 
            WHERE user_id = $2 AND product_id = $3;
        `;
        const values = [newExpiryDate, userId, productId];

        try {
            await db.query(query, values);
        } catch (error) {
            console.error(`Error updating subscription expiry:`, error.message);
            throw new Error('Database query failed while updating subscription expiry.');
        }
    },
};

module.exports = UserProduct;