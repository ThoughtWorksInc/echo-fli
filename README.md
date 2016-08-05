[![Build Status](https://snap-ci.com/ThoughtWorksInc/echo-fli/branch/master/build_image)](https://snap-ci.com/ThoughtWorksInc/echo-fli/branch/master)

# FLI: AWS Lambda and Skill for Alexa

## Getting Started

### Install NVM and Node
```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
```
close and reopen terminal

```
$ nvm install 4.4.2
$ nvm use
```
Note: AWS Lambda runs on node 4.3.2. However, snap-ci/npm install is excessively flaky with this version of node
(see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/understanding-how-users-interact-with-skills).
Therefore, we are using node 4.4.2. This is not even currently an issue since the smoke tests hit the real lambda
which uses 4.3.2. The only potential problems would be inconsistencies with unit tests (when we eventually have them),
but I think the flakiness we are observing with 4.3.2 far outweigh the differences we will see between
4.3.2 and 4.4.2 especially considering the relative simplicity of this lambda and the fact that we are using a later rather
than an earlier version of node.

### Install Dependencies
```
$ npm install
```

### Setup an AWS Account
1. Register for an AWS developer account here: https://developer.amazon.com/appsandservices
 (account needs to be US East to support the free pricing tier)  
2. Setup AWS credentials in your environment for deploying the lambda. Rather than using the root account user credentials,
we recommend creating an IAM user with a role which allows it to deploy lambdas.
  * tl;dr
```
$ export AWS_ACCESS_KEY_ID=<key>
$ export AWS_SECRET_ACCESS_KEY=<secret>
or
$ export AWS_PROFILE=<profile>
```
  * Long Version: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html

## Running Lint
```
$ npm run lint
```

## Running Unit Tests
```
$ npm test
```

## Deploying Lambda
```
$ export AWS_ROLE_ARN=<role_arn>
$ npm run package
$ npm run deploy
```
Note: Defining the lambda role is only required the first time you deploy a lambda;
it is only required on subsequent deploys if you want to use a different role.

## Running Smoke Tests on Deployed Lambda
```
$ npm run smoke
```

## Running End-to-End Tests on Deployed Lambda and FLI server
```
$ npm run e2e
```

## Alexa Skills Setup

### Setup Lambda Alexa Trigger

1. Go to the AWS console lambda service page: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions?display=list
2. Click on 'echoFli' (this is the name of the function defined in the 'name' key of package.json
3. Click 'Triggers' tab > '+ Add Trigger' > 'Alexa Skills Kit'. Notes:
4. Copy the ARN in the upper right-hand corner  

Notes:
- These manual steps are necessary because unfortunately, there is currently no documented api for adding an Alexa trigger programmatically.
- This only needs to be done once. The Alexa trigger will not be removed when the Lambda is redeployed.

### Setup Alexa Skill

1. Go to https://developer.amazon.com/appsandservices  
2. Go to 'Alexa' on the upper menu bar  
3. Click 'Get Started' with the Alexa Skills Kit  
4. Click "Add A New Skill'  
5. Fill out required skill information where not defaulted for invocation and skill name  
6. Fill out interaction model with information from the speechAssets subdirectory  
7. Give the Lambda ARN as the Endpoint (this was copied in the last step of the previous section).
8. Set Account Linking to 'no', subject to change when linking users in our system  
9. Click 'next'  
10. Under 'testing', you should see that the skill is enabled, and you can start using the voice simulator, service simulator, or the Echo itself. If it is not enabled, follow the instructions on the screen to enable it.  
11. Pat yourself on the back! You're ready to rumble!  

Notes:
- These manual steps are necessary because unfortunately, there is currently no documented api for provisioning an Alexa Skill programmatically.
- This only needs to be done once.

## Keeping Lambda and Alexa Skill in Sync

Since there does not yet appear to be an API for creating or editing Alexa Skills, changes to the interaction model (ie: files under the 'speechAssets' directory) must be manually updated in the AWS Developer Console.

AWS does supply an API for deploying lambdas, so changes to the lambda functionality (ie: js files under the 'functions' directory) can be automated. For local testing, please refer to the previous sections explaining the npm scripts. A Snap CI pipeline has also been provisioned which will deploy the lambda.

Down the road, when linking Echo users to users in our system for the purpose of distinguishing between different teams that use our skill, this link might prove helpful: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/linking-an-alexa-user-with-a-user-in-your-system
