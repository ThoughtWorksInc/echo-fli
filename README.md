# Fli: AWS Lambda and Skill for Alexa
##### Steps for development
**AWS Development:**  
0. Register for an AWS developer account here: https://developer.amazon.com/appsandservices
 (account needs to be US East to support the free pricing tier)  
1. Setup AWS credentials in your environment for deploying the lambda. Rather than using the root account user credentials,
we recommend creating an IAM user with a role which allows it to deploy lambdas.
..* tl;dr
```
export AWS_ACCESS_KEY_ID=<key>
export AWS_SECRET_ACCESS_KEY=<secret>
or
export AWS_PROFILE=<profile>
```
..* Long Version: http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html

**Lambda:**  
2. npm install
3. npm run package
4. npm run deploy
5. Go to the AWS console lambda service page: https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions?display=list
6. Click on 'echo-fli' (this is the name of the function defined in the 'name' key of package.json
7. Click 'Triggers' tab > '+ Add Trigger' > 'Alexa Skills Kit'. Notes:
..* Unfortunately, there is currently no documented way to add the Alexa trigger programmatically
..* This only needs to be done the first time the lambda is created. The trigger will remain in place for subsequently deployed lambdas.
8. Copy the ARN in the upper right-hand corner  

**Alexa Skill:**  
Notes:
* Unfortunately, there is currently no documented way to create the Alexa skill programmatically
* This only needs to be done once.
9. Return here: https://developer.amazon.com/appsandservices  
10. Go to 'Alexa' on the upper menu bar  
11. Click 'Get Started' with the Alexa Skills Kit  
12. Click "Add A New Skill'  
13. Fill out required skill information where not defaulted for invocation and skill name  
14. Fill out interaction model with information from the speechAssets subdirectory  
15. Give the Lambda ARN as the Endpoint  
16. Set Account Linking to 'no', subject to change when linking users in our system  
17. Click 'next'  
18. Under 'testing', you should see that the skill is enabled, and you can start using the voice simulator, service simulator, or the Echo itself. If it is not enabled, follow the instructions on the screen to enable it.  
19. Pat yourself on the back! You're ready to rumble!  

Until we get CI set up, you can make edits to the contents of speechAssets and revise the Alexa Skill, and make changes to the Lambda function and reupload the zip file. This will update your lambda/skill and allow you to invoke it on the Echo with your changes.

Down the road, when linking Echo users to users in our system for the purpose of distinguishing between different teams that use our skill, this link might prove helpful: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/linking-an-alexa-user-with-a-user-in-your-system

**TODO:**
Currently Alexa will add events that are not included in our list of event types. This is because custom slot types act as a guide for user input, but do not exclude other terms. See here for a full explanation: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interaction-model-reference#h2_custom_syntax

To fix this, we can verify the user input on our end to make sure it is one of the events in the list. See here for details: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/handling-requests-sent-by-alexa#Handling%20Possible%20Input%20Errors

*last updated on July 18, 2016 by Samantha Stilson, with todo for user input verification*
