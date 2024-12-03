const { getIP } = require('../utils/ipUtils');
const { setContext } = require('../utils/contextUtils');

const ipLogger = (req, res, next) => {
    const ipAddress = getIP(req);
    setContext('ipAddress', ipAddress);
    next();
};

module.exports = ipLogger;