const { appleNotification } = require("./service/appleNotification");

let response;

exports.lambdaHandler = async (event) => {
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