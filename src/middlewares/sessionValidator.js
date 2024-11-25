const { validateSessionData } = require('../services/sessionService');

const sessionValidator = (req, res, next) => {
    const clientId = req.body.clientId;

    if (!clientId || !validateSessionData(clientId)) {
        return res.status(401).json({
            success: false,
            message: "Session has expired or is invalid.",
        });
    }

    next();
};

module.exports = sessionValidator;