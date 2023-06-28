const { Provider, Notification } = require("@parse/node-apn");

// Normally, we would retrieve certificate values from Secrets Manager
// const appleNotification = async (token: string, key: string, cert) => {
        // const options = {
        //     key: key,
        //     cert: cert,
        //     production: true
        // }

const appleNotification = async (deviceToken) => {
    try {
        const keyId = process.env.APPLE_PN_KEY_ID;
        const teamId = process.env.APPLE_TEAM_ID;
        const p8 = process.env.AUTHP8;

        const options = {
            token: {
                key: p8,
                keyId: keyId,
                teamId: teamId
            },
            production: false
        }

        const apnProvider = new Provider(options);

        const note = new Notification();
        note.expiry = Math.floor(Date.now() / 10000) + 3600;
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = "Test Notification"
        note.topic = "tech.inspirare.POC"

        // We can add custom fields to display personalised data
        // note.payload = { "messageFrom": "name" }

        return apnProvider.send(note, deviceToken).then(result => {
            if (result.failed.length > 0) {
                console.debug('Failed: ', result.failed);
            }
            console.debug('Sent: ', result.sent);
        }).catch(error => console.error('error: ', error))
    }
    catch (error) {
        console.error("Error sending push notification: ", error);
    }
}
module.exports = { appleNotification };