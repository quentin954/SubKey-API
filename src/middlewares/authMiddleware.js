const { verifyToken } = require('../utils/jwtHelper');
const Role = require('../models/roleModel');

const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.',
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};

const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No valid user data found.',
        });
    }

    try {
        const userRoles = await Role.getRolesByUserId(req.user.user_id);
        const isAdmin = userRoles.some(role => role.role_name === 'Admin');
        if (!isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admins only.',
            });
        }

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};

module.exports = { isAuthenticated, isAdmin };
