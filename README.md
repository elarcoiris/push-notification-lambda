# push-notification-lambda

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- events - Invocation events that you can use to invoke the function.
- tests - Unit tests for the application code.
- template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

## Using the SAM CLI to build and test locally

The SAM CLI builds a docker image from a Dockerfile and then installs dependencies defined in `push-notification-lambda/package.json` inside the docker image. The processed template file is saved in the `.aws-sam/build` folder.

First, you will need to update the events/event.json file body field with the device token from your target destination.
The token is only valid for the issuing app and for the purpose of receiving a push notification.

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