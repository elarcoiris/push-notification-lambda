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
        const options = {
            token: {
                key: "./util/AuthKey_4RN3W3944L.p8",
                keyId: "4RN3W3944L",
                teamId: "7PY58KJ7Y2"
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