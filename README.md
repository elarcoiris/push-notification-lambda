# push-notification-lambda

This is a Serverless application that utilises Lambda, API Gateway and DynamoDB.

- events - Invocation events that you can use to invoke the function.
- tests - Unit tests for the application code.
- service - the functions.
- serverless.yml - A template that defines the application's AWS resources.

## Setup

You will require an Apple Developer push certificate in the form of a .p8 file. These can be obtained from the developer console.

Ideally, your private keys should be stored in Secrets Manager, and an example of this implementation has also been provided.

If you don't already have Serverless, install it globally:

```bash
npm install -g serverless
```

Create an .env.local file for env vars and values:

APPLE_PN_KEY_ID

APPLE_TEAM_ID

KEY_PATH

JWT_SECRET

Generate a random base64 string for the JWT_SECRET:

```bash
openssl rand -base64 32
```

## Run

```bash
push-notification-lambda$ npm install
push-notification-lambda$ npm start
```

Setup your postman to send POST requests to:

http://localhost:3000/dev/notification

http://localhost:3000/dev/onboard

https://{apigatewayid}.execute-api.ap-southeast-2.amazonaws.com/dev/notification

https://{apigatewayid}.execute-api.ap-southeast-2.amazonaws.com/dev/onboard

Note that the body format changes for invoking the functions through API Gateway.

Each function's route is defined in serverless.yml:

```yaml
      Events:
        PushNotification:
          Type: Api
          Properties:
            Path: /notification
            Method: post
```

## Unit tests

Tests are defined in the `tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run unit tests from your local machine.

```bash
push-notification-lambda$ npm run test
```

## Deploy

```bash
push-notification-lambda$ npm run deploy
```