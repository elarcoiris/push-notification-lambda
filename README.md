# push-notification-lambda

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- events - Invocation events that you can use to invoke the function.
- tests - Unit tests for the application code.
- template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project.

## Using the SAM CLI to build and test locally

The SAM CLI builds a docker image from a Dockerfile and then installs dependencies defined in `push-notification-lambda/package.json` inside the docker image. The processed template file is saved in the `.aws-sam/build` folder.

## Setup

You will require an Apple Developer push certificate in the form of a .p8 file. These can be obtained from the developer console.

There are two ways you can implement push notification auth. We will use token for user notifications, and later transition to certificate for VoIP background notifications.

Ideally, your private keys should be stored in Secrets Manager, and an implementation example has also been provided.

## Settings

First, you will need to update the events/event.json file body field with the device token from your target destination. I have provided another tool to assist in device token retrievel, called ios-pn-tool, that can be ran in Xcdode.


You should create your own .env.local file for env vars:
APPLE_PN_KEY_ID
APPLE_TEAM_ID
AUTHP8

AUTHP8 is the value of your .p8 file.


```bash
push-notification-lambda$ npm install
push-notification-lambda$ npm run build
push-notification-lambda$ npm run local
```

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
push-notification-lambda$ sam local start-api
push-notification-lambda$ curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

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
Serverless has a smoother first deployment process and better feedback on deployment issues. It can be handy when trouble shooting what permissions are missing when SAM fails. But I find the SAM local invoke experience easier to start out of the box.

You can run either of these two commands to deploy the Lambda to your own AWS environment:

```bash
npm run sam:deploy
npm run serverless:deploy
```

If using the default AWS_PROFILE or other custom name, update the package.json script to reflect the relevant profile credentials.

If using SAM, you can also tear down your stack:

```bash
npm run sam:rollback
```