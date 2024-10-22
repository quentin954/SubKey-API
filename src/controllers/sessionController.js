const crypto = require('crypto');
const { storeSessionData } = require('../services/sessionService');
const { v4: uuidv4 } = require('uuid');

const initializeSession = (req, res) => {
    const clientKey = req.body.ClientKey;
    if (!clientKey) {
        return res.status(400).json({
            success: false,
            message: "ClientKey is required."
        });
    }

    const clientPublicKey = Buffer.from(clientKey, 'hex');
    let clientPublicKeyResource;

    try {
        clientPublicKeyResource = crypto.createPublicKey(clientPublicKey);
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid ClientKey."
        });
    }

    const aesKey = crypto.randomBytes(32);
    const encryptedAesKey = crypto.publicEncrypt(clientPublicKeyResource, aesKey);
    const aesKeyHex = Buffer.from(encryptedAesKey).toString('hex');

    const clientId = uuidv4();
    storeSessionData(clientId, aesKey);

    return res.json({
        success: true,
        message: "Session initialized successfully.",
        sessionid: clientId,
        aeskey: aesKeyHex
    });
};

module.exports = { initializeSession };