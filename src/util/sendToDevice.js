// import { AWSClient } from "./AWSClient";
// const { appleNotification } = require("../service/appleNotification");

// const filterOn = (obj, key, value) => obj.filter(v => v[key] === value);

// export const sendToDevice = async (data) => {
    // try {
    //     const devices = []

    //     const appleDevices = filterOn(devices, 'field', 'value');
    //     const mapApple = appleDevices(val => val.pushToken);
    //     const appleSet = new Set(mapApple);
    //     const uniqueAppleValues = [...appleSet];

    //     if(uniqueAppleValues.length > 0) {
    //         await sendPushNotification(uniqueAppleValues);
    //     }
    // }
    // catch (error) {
    //     console.error("There was an issue sending the push notification: ", error);
    // }
// }

// const sendPushNotification = async (uniqueAppleValues) => {
    // Normally, we would have the key saved in Secrets Manager
    // But I am providing my own developer certificate as a file
    // const awsHelper = new AWSClient();
    // const key = await awsHelper.getSecret("APN_KEY_PEM") as string;
    // const cert = await awsHelper.getSecret("APN_CERT_PEM") as string;
    // for(let i =1; i < uniqueAppleValues.length; i++) {
        // await appleNotification(uniqueAppleValues[i], key, cert)
    //     await appleNotification(uniqueAppleValues[i])

    // }
// }