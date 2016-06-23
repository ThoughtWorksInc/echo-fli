var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var AlexaSkill = require('./AlexaSkill');

var Fli = function () {
    AlexaSkill.call(this, APP_ID);
};

Fli.prototype = Object.create(AlexaSkill.prototype);
Fli.prototype.constructor = Fli;

Fli.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("Fli onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
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
};

Fli.prototype.intentHandlers = {
    "FliIntent": function (intent, session, response) {
        var http = require('http');
        var moment = require('moment');

        var postData = JSON.stringify({
            eventType: intent.slots.Event.value,
            occurredAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            story: intent.slots.Number.value
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

exports.handler = function (event, context) {
    var fli = new Fli();
    fli.execute(event, context);
};

