const { clearContext } = require('../utils/contextUtils');

const clearContextMiddleware = (req, res, next) => {
    res.on('finish', () => {
        clearContext();
    });
    next();
};

module.exports = clearContextMiddleware;