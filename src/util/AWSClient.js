const { config, SecretsManager } = require('aws-sdk');

export class AWSClient {
    
    secretsManager;

    constructor() {
        config.update({
            region: process.env.AWS_DEFAULT_REGION || 'ap-southeast-2'
        });

        this.secretsManager = new SecretsManager();
    }

    async getSecret(key) {
        if (process.env.ENV === 'development' && process.env[key]) {
            return process.env[key];
        }

        try {
            return new Promise((resolve, reject) => {
                this.secretsManager.getSecretValue({
                    SecretId: `/example_channel/${key}`,
                }, (err, data) => {
                    if (err) {
                        console.error(`Error retrieving secret for ${key}`);
                        reject(err.message);
                    }
                    else if (data.SecretString) {
                        resolve(data.SecretString)
                    }
                    else if (data.SecretBinary) {
                        resolve(data.SecretBinary)
                    }
                })
            });
        }
        catch (error) {
            console.error(`There was an issue retrieving key ${key} from secrets: ${JSON.stringify(error.message)}`)
        }
    }
}