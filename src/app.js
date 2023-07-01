const { appleNotification } = require("./service/appleNotification");
const { onboard } = require("./service/onboard");

let response;

const lambdaHandler = async (event) => {
    try {
        let jsonBody = JSON.parse(event.body);
        let token = jsonBody.deviceToken;
        await appleNotification(token);

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
        let { id, deviceToken } = jsonBody;

        await onboard(id, deviceToken);

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