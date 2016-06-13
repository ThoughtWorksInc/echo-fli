/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * Fli is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Fli = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Fli.prototype = Object.create(AlexaSkill.prototype);
Fli.prototype.constructor = Fli;

Fli.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Fli onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Fli.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Fli onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var repromptText = "To add an event, say add event followed by the event type.";
    var speechOutput = "Welcome to Fly!" + repromptText;
    response.ask(speechOutput, repromptText);
};

Fli.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Fli onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Fli.prototype.intentHandlers = {
    // register custom intent handlers
    "FliIntent": function (intent, session, response) {
        response.tell("It seems you want to add an event");
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("There's no help for you.");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the Fli skill.
    var fli = new Fli();
    fli.execute(event, context);
};

