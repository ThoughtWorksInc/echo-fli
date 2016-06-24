###### Fli Echo interface.
### Skill and Lambda for interacting with Amazon Alexa.

# Steps for development
**AWS Development:**
1. Register for an AWS developer account here: https://developer.amazon.com/appsandservices
  * account needs to be US East to support the free pricing tier

**Lambda:**
2. Go to the AWS console: https://console.aws.amazon.com/console/home?region=us-east-1
3. Click on the 'Lambda' option
4. Click 'Create a Lambda Function'
5. Skip blueprint selection
6. Give lambda function a name
7. Zip index.js and AlexaSkill.js with the node_modules from the repo.
  * note: file permissions must be world readable, advise compressing files separately
8. Upload zip folder as lambda function code
9. Give Lambda function handler default role
10. Click 'next', review, and then 'create function'
11. Under the 'Event sources' tab, add 'Alexa Skills Kit'
12. Copy the ARN in the upper right-hand corner

**Alexa Skill:**
13. Return here: https://developer.amazon.com/appsandservices
14. Go to 'Alexa' on the upper menu bar
15. Click 'Get Started' with the Alexa Skills Kit
16. Click "Add A New Skill'
17. Fill out required skill information where not defaulted for invocation and skill name
18. Fill out interaction model with information from the speechAssets subdirectory
19. Give the Lambda ARN as the Endpoint
20. Set Account Linking to 'no', subject to change when linking users in our system
21. Click 'next'
22. Under 'testing', you should see that the skill is enabled, and you can start using the voice simulator, service simulator, or the Echo itself. If it is not enabled, follow the instructions on the screen to enable it.
23. Pat yourself on the back! You're ready to rumble!

Until we get CI set up, you can make edits to the contents of speechAssets and revise the Alexa Skill, and make changes to the Lambda function and reupload the zip file. This will update your lambda/skill and allow you to invoke it on the Echo with your changes.

Down the road, when linking Echo users to users in our system for the purpose of distinguishing between different teams that use our skill, this link might prove helpful: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/linking-an-alexa-user-with-a-user-in-your-system

*last updated on June 24, 2016 by Matthew Sloane, with development steps**
