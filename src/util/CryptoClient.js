const { AWSClient } = require("./AWSClient");
const { createCipheriv, createDecipheriv, randomBytes } = require('crypto');

class CryptoClient {
    
    encrypt = async (value) => {
        const nonce = await generateNonce();
        const key = await toUint8Array(await getKey());
    
        const cipher = createCipheriv('aes-256-gcm', key, nonce);
        cipher.setEncoding('base64');
        let encryptedBase64 = '';
        cipher.on('data', (chunk) => encryptedBase64 += chunk);
        cipher.write(value);
        cipher.end();
        const tag = cipher.getAuthTag();
    
        const cipherText = await toUint8Array(encryptedBase64);
        const concat = Buffer.concat([cipherText, nonce, tag]);
        const final = concat.toString('base64');
    
        return final;
    }
    
    decrypt = async (key, nonce, cipher) => {
        const authTagLength = 16;
        const decipher = createDecipheriv('chacha20-poly1305', key, nonce, {
            authTagLength
        })
        const info = cipher.slice(0, 8);
        let decrypted = decipher.update(info).toString('utf16le');
        // decrypted += decipher.final('utf16le');
        return decrypted;
    }
    
    generateNonce = async () => {
        return randomBytes(12);
    }
    
    getKey = async (key, salt) => {
        return new Promise((resolve, reject) => {
            const iterations = 125000;
            const keylen = 32;
            const digest = 'sha256';
            crypto.pbkdf2(key, salt, iterations, keylen, digest, (error, result) => {
                if (error) {
                    reject(error.message);
                }
                resolve(result.toString('hex'));
            });
        })
    }
    
    toUint8Array = async (value) => {
        const uint8array = new Uint8Array(Buffer.from(value, 'base64'));
        return new Uint8Array(uint8array);
    }
    
    saltAndTokenise = async (userId) => {
        let token, salt;
        try {
            salt = await createSalt();
            token = await tokenise(salt, userId);
        }
        catch (error) {
            console.error(`Failed to authorise user: ${error.message}`)
        }
        return [token, salt];
    }
    
    decryptValue = async (userId) => {
        let token;
        try {
            const info = await this.userService.getUser(userId);
            token = await tokenise(info.userSalt, userId);
        }
        catch (error) {
            console.error(`Failed to decrypt user: ${error.message}`)
        }
        return token;
    }
    
    tokenise = async (salt, userId) => {
        let hmac;
        try {
            const secret = await getSecret('AUTH_KEY');
            const key = await getKey(secret, salt);
            hmac = crypto.createHmac('sha256', key).update(userId).digest('hex');
        }
        catch (error) {
            console.error(`Failed to tokenise: ${error.message}`);
        }
        return Promise.resolve(hmac);
    }
    
    getSecret = async (key) => {
        const awsClient = new AWSClient()
        return awsClient.getSecret(key);
    }
    
    createSalt = async () => {
        return Promise.resolve(crypto.randomBytes(32).toString('hex'));
    }
}
module.exports = { CryptoClient }