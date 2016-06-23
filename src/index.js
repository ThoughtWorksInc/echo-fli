var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var AlexaSkill = require('./AlexaSkill');

var Fli = function () {
    AlexaSkill.call(this, APP_ID);
};

Fli.prototype = Object.create(AlexaSkill.prototype);
Fli.prototype.constructor = Fli;

Fli.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("Fli onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var commonText = "To add an event, say 'add event event type for story story ID.";
    var repromptText = "Remember, " + commonText;
    var promptText = "Welcome to Fly. " + commonText;
    response.ask(promptText, repromptText);
};

Fli.prototype.intentHandlers = {
    "FliIntent": function (intent, session, response) {
        var http = require('http');
        var moment = require('moment');

        var postData = JSON.stringify({
            eventType: intent.slots.Event.value,
            occurredAt: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
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
          if (res.statusCode === 409) {
            response.tell("Sorry, your event already exists.");
          } else {
            response.tell("Event added successfully");
          }
          res.setEncoding('utf8');
        });

        req.on('error', function(e) {
            response.tell("Sorry, I was unable to add your event.");
        });

        req.write(postData);
        req.end();
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Event types are words such as start and end, and story IDs are numbers." +
                     "A sample input is as follows: 'add event start for story 19'.");
    }
};

exports.handler = function (event, context) {
    var fli = new Fli();
    fli.execute(event, context);
};

