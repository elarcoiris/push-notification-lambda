const { AWSClient } = require("../util/AWSClient");

const createUser = async (appleId, deviceToken, pkPushToken, email, firstName, lastName) => {
    const awsClient = new AWSClient();
    const tableName = "users";
    const user = await awsClient.dynamoDB.put({
        TableName: tableName,
        Item: {
            appleId: { S: appleId },
            deviceToken: { S: deviceToken },
            pkPushToken : { S: pkPushToken },
            email: { S: email },
            firstName: { S: firstName },
            lastName: { S: lastName }
        }
    }).promise()
    console.debug('User insert result: ', JSON.stringify(user));
}

module.exports = { createUser }