const db = require('../config/database');

const Product = {
    createProduct: async ({ productName, statusId }) => {
        const query = `
            INSERT INTO products (product_name, status_id)
            VALUES ($1, $2) RETURNING *;
        `;
        const values = [productName, statusId];
        
        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error(`Error creating product: ${error.message}`, { productName, statusId });
            throw new Error('Database query failed while creating product.');
        }
    },

    getProductByName: async (productName) => {
        if (!productName || typeof productName !== 'string') {
            throw new Error('Invalid product name provided.');
        }

        const query = `SELECT * FROM products WHERE product_name = $1 LIMIT 1;`;

        try {
            const result = await db.query(query, [productName]);
            if (result.rowCount === 0) {
                return null;
            }
            return result.rows[0];
        } catch (error) {
            console.error(`Error fetching product by name "${productName}": ${error.message}`);
            throw new Error('Database query failed while fetching product by name.');
        }
    },

    getAllProductsWithStatus: async () => {
        const query = `
            SELECT p.product_name, ps.status_name
            FROM products p
            JOIN product_status ps ON p.status_id = ps.status_id;
        `;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching products with status:', error.message);
            throw new Error('Database query failed.');
        }
    },
};

module.exports = Product;