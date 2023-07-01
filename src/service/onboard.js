const { AWSClient } = require("../util/AWSClient");

const createUser = async (id, deviceToken, email, firstName, lastName) => {
    const awsClient = new AWSClient();
    const tableName = "users";
    const user = awsClient.dynamoDB.put({
        TableName: tableName,
        Item: {
            id: { S: id },
            deviceToken: { S: deviceToken },
            email: { S: email },
            firstName: { S: firstName },
            lastName: { S: lastName }
        }
    }).promise()
    console.debug('User insert result: ', JSON.stringify(user));
}

const onboard = async (user) => {

}
module.exports = { createUser, onboard }