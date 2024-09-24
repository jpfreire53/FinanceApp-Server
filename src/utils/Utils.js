const fs = require("fs");
const crypto = require("crypto");

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');

const Utils = {
    decryptData: function (encryptedData) {
        try {
          const buffer = Buffer.from(encryptedData, 'base64');
          const decrypted = crypto.privateDecrypt(
            {
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            },
            buffer
          );
          return decrypted.toString('utf8');
        } catch (err) {
          console.error('Erro ao descriptografar:', err.message);
          return null;
        }
    }
}

module.exports = Utils;