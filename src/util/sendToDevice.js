const { AWSClient } = require("./AWSClient");
const { appleNotification } = require("../service/appleNotification");

const filterOn = (obj, key, value) => obj.filter(v => v[key] === value);

export const sendToDevice = async (data) => {
    const awsClient = new AWSClient();
    const tableName = "users";
    try {
        const devices = await awsClient.dynamoDB.query({
            TableName: tableName,
            IndexName: "id",
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": data.id
            }
        }).promise();

        const values = devices.Items ? devices.Items:[];

        // Filter settings
        const registeredValues = filterOn(values, 'status', 'registered');
        const appleDevices = filterOn(registeredValues, 'field', 'value');


        const mapApple = appleDevices(val => val.pushToken);
        const appleSet = new Set(mapApple);
        const uniqueAppleValues = [...appleSet];

        if(uniqueAppleValues.length > 0) {
            await sendPushNotification(uniqueAppleValues);
        }
    }
    catch (error) {
        console.error("There was an issue sending the push notification: ", error);
    }
}

const sendPushNotification = async (uniqueAppleValues) => {
    const awsHelper = new AWSClient();
    const key = await awsHelper.getSecret("APN_KEY_PEM");
    const cert = await awsHelper.getSecret("APN_CERT_PEM");
    for(let i =1; i < uniqueAppleValues.length; i++) {
        await appleNotification(uniqueAppleValues[i], key, cert)
    }
}