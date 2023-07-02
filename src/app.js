const { appleNotification } = require("./service/appleNotification");
const { createUser } = require("./service/onboard");

let response;

const lambdaHandler = async (event) => {
    try {
        let jsonBody = JSON.parse(event.body);

        let deviceToken;
        if (jsonBody.deviceToken) {
            deviceToken = jsonBody.deviceToken
        }

        await appleNotification(deviceToken);

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Notification processed'
            })
        }
    } 
    catch (error) {
        console.error('lambdaHandler error: ', error);
        return error;
    }

    return response;
};

const onboardHandler = async (event) => {
    try {
        let jsonBody = JSON.parse(event.body);
        let { appleId, deviceToken, pkPushToken, email, firstName, lastName } = jsonBody;

        await createUser(appleId, deviceToken, pkPushToken, email, firstName, lastName);

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'User onboarding processed'
            })
        }
    } 
    catch (error) {
        console.error('onboardHandler error: ', error);
        return error;
    }

    return response;
}
module.exports = { lambdaHandler, onboardHandler }