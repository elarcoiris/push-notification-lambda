const { tmpdir } = require('os');
const { promises } = require('fs');
const { join } = require('path');

class CertificateService {
    // private keysCreated: boolean;
    keyPath;
    password;

    constructor() {
        // this.keysCreated = false;
        this.keyPath = null;
        this.password = null;
    }

    async getKeys(){
        // if (!this.keysCreated) {
            this.keyPath = await promises.mkdtemp(join(tmpdir(), 'apple-push-certificate'));
            try {

                await promises.writeFile(join(this.keyPath, 'wwdr.pem'),
                Buffer.from('APPLE_WWDR_PEM'), 'base64')

                await promises.writeFile(join(this.keyPath, 'tech.inspirare.POC.pem'),
                Buffer.from('APPLE_PUSH_PEM'), 'base64')

                const base64Password = 'APPLE_PK_PASSWORD';
                this.password = Buffer.from(base64Password, 'base64').toString();
                
                // this.keysCreated = true;
            }
            catch (error) {
                console.error(error);
            }
        // }
        return [this.keyPath, this.password];
    }
}
module.exports = { CertificateService }