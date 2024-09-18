// const crypto = require('crypto');

import jwt from "../modules/jwt.js";

// ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');

module.exports = {
    //
    encrypt: () => {
        return crypto.randomUUID();
    },
    getUserIdFromToken: async (token) => {
        if (!token) return null;
        const userToToken = jwt.decode(token);
        return userToToken.id;
    },
};
