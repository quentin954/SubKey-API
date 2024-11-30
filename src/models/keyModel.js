const db = require('../config/database');

const Key = {
    getActiveKey: async (productKey) => {
        if (!productKey || typeof productKey !== 'string') {
            throw new Error('Invalid product key provided.');
        }

        const query = `
            SELECT * FROM keys
            WHERE product_key = $1 AND is_active = TRUE AND is_banned = FALSE
            LIMIT 1;
        `;
        const values = [productKey];

        try {
            const result = await db.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            console.error(`Error fetching active key for ${productKey}: ${error.message}`);
            throw new Error('Database query failed while fetching active key.');
        }
    },

    deactivateKey: async (keyId) => {
        if (!keyId || typeof keyId !== 'number') {
            throw new Error('Invalid key ID provided.');
        }

        const query = `
            UPDATE keys
            SET is_active = FALSE
            WHERE key_id = $1;
        `;
        const values = [keyId];

        try {
            const result = await db.query(query, values);
            if (result.rowCount === 0) {
                throw new Error(`No active key found with ID: ${keyId}`);
            }
        } catch (error) {
            console.error(`Error deactivating key with ID ${keyId}: ${error.message}`);
            throw new Error('Database query failed while deactivating the key.');
        }
    },

    createKey: async ({ productKey, productId, durationSeconds }) => {
        const query = `
            INSERT INTO keys (product_key, product_id, duration_seconds)
            VALUES ($1, $2, $3) RETURNING *;
        `;
        const values = [productKey, productId, durationSeconds];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(`Error creating key: ${error.message}`, { productKey, productId, durationSeconds });
            throw new Error('Database query failed while creating key.');
        }
    },

    updateKeyBanStatus: async (keyId) => {
        const query = `
            UPDATE "keys"
            SET "is_banned" = TRUE
            WHERE "key_id" = $1
            RETURNING *;
        `;
        const values = [keyId];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(`Error banning key with key_id "${keyId}":`, error.message);
            throw new Error('Database query failed while banning key.');
        }
    }
};

module.exports = Key;