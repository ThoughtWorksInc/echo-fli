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
    var commonText = "To add an event, say 'add event' followed by the event type.";
    var repromptText = "Remember, " + commonText;
    var promptText = "Welcome to Fly. " + commonText;
    response.ask(promptText, repromptText);
};

Fli.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("Fli onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Fli.prototype.intentHandlers = {
    // register custom intent handlers
    "FliIntent": function (intent, session, response) {
        var http = require('http');

        var postData = JSON.stringify({
            eventType: "some blah type",
            occurredAt: "2015-01-01 10:10:00",
            story: "123456789"
        });

        var options = {
            hostname: 'fli-change.herokuapp.com',
            port: 80,
            path: '/events',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': postData.length
          }
        };

        var req = http.request(options, function(res) {
          console.log("STATUS: " + res.statusCode);
          console.log("HEADERS: " + JSON.stringify(res.headers));
          if (res.statusCode === 409) {
            response.tell("Sorry, your event already exists.");
          } else {
            response.tell("Event added successfully");
          }
          res.setEncoding('utf8');
          res.on('data', function(chunk) {
              console.log("BODY: " + chunk);
          });
          res.on('end', function() {
              console.log('No more data in response.');
          });
        });

        req.on('error', function(e) {
            console.log("problem with request: " + e.message);
            response.tell("Sorry, I was unable to add your event.");
        });

        req.write(postData);
        req.end();
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

