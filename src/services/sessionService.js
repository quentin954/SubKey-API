let sessionData = new Map();

const storeSessionData = (clientId, aesKey) => {
    sessionData.set(clientId, {
        aesKey: aesKey,
        timestamp: new Date()
    });
};

const validateSessionData = (clientId) => {
    const sessionInfo = sessionData.get(clientId);
    if (sessionInfo) {
        if ((new Date() - sessionInfo.timestamp) / 1000 < 30) {
            return true;
        }
        sessionData.delete(clientId);
    }
    return false;
};

module.exports = { storeSessionData, validateSessionData };