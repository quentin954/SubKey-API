const getIP = (req) => {
    if (!req || !req.headers) {
        return null;
    }

    let ipAddress = null;

    if (req.headers['x-client-ip']) {
        ipAddress = req.headers['x-client-ip'];
    } else if (req.headers['x-forwarded-for']) {
        ipAddress = req.headers['x-forwarded-for'].split(',')[0].trim();
    } else if (req.headers['x-forwarded']) {
        ipAddress = req.headers['x-forwarded'];
    } else if (req.headers['forwarded-for']) {
        ipAddress = req.headers['forwarded-for'];
    } else if (req.headers['forwarded']) {
        ipAddress = req.headers['forwarded'];
    } else if (req.connection && req.connection.remoteAddress) {
        ipAddress = req.connection.remoteAddress;
    } else if (req.socket && req.socket.remoteAddress) {
        ipAddress = req.socket.remoteAddress;
    } else if (
        req.connection &&
        req.connection.socket &&
        req.connection.socket.remoteAddress
    ) {
        ipAddress = req.connection.socket.remoteAddress;
    }

    return ipAddress;
};

module.exports = { getIP };