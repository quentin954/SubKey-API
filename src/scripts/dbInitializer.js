const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Role = require('../models/roleModel');
const UserRole = require('../models/userRoleModel');
const ProductStatus = require('../models/productStatusModel');

const initializeEssentialData = async () => {
    try {
        console.log('Checking database initialization...');

        const productStatuses = [
            { statusName: 'Operational', isActive: true },
            { statusName: 'Use at own Risk', isActive: true },
            { statusName: 'Updating', isActive: false },
            { statusName: 'Detected', isActive: false },
        ];

        for (const status of productStatuses) {
            const existingStatus = await ProductStatus.getStatusByName(status.statusName);
            if (!existingStatus) {
                await ProductStatus.createProductStatus(status);
                console.log(`Inserted product status: ${status.statusName}`);
            }
        }

        const existingAdminRole = await Role.getRoleByName('Admin');
        if (!existingAdminRole) {
            await Role.createRole('Admin', 100);
            console.log('Inserted Admin role');
        }

        const users = await User.getAllUsers();
        if (users.length > 0) {
            console.log('Users already exist. Skipping initialization.');
            return;
        }

        const username = process.env.INIT_ADMIN_USERNAME;
        const password = process.env.INIT_ADMIN_PASSWORD;
        const email = process.env.INIT_ADMIN_EMAIL;

        if (!username || !password || !email) {
            console.error(
                'No admin user configuration found! Please specify INIT_ADMIN_USERNAME, INIT_ADMIN_PASSWORD, and INIT_ADMIN_EMAIL in the environment variables.'
            );
            process.exit(1);
        }

        console.log(`Creating initial admin user: ${username}`);
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = await User.create({
            username,
            password: hashedPassword,
            email
        });

        const adminRole = await Role.getRoleByName('Admin');
        if (!adminRole) {
            throw new Error('Admin role not found in the database. Please ensure roles are seeded.');
        }

        await UserRole.assignRole(adminUser.user_id, adminRole.role_id);
        console.log(`Admin user "${username}" created successfully.`);

        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Error during database initialization:', error.message);
        process.exit(1);
    }
};

module.exports = initializeEssentialData;