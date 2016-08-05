const APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
const AlexaSkill = require('./AlexaSkill');

const Fli = function () {
  AlexaSkill.call(this, APP_ID);
};

Fli.prototype = Object.create(AlexaSkill.prototype);
Fli.prototype.constructor = Fli;

Fli.prototype.eventHandlers.onLaunch = (launchRequest, session, response) => {
  var repromptText = 'Remember, to add an event, say \'add event, event-type, for story, story ID.';
  var promptText = 'Let\'s fly!';
  response.ask(promptText, repromptText);
};

Fli.prototype.intentHandlers = {
  'FliIntent': (intent, session, response) => {
    const eventType = intent.slots.Event.value;

    validateEvent(eventType, function (err) {
      if (err) {
        response.tell(err);
      } else {
        addEvent(eventType, intent, response);
      }
    });
  },
  'AMAZON.HelpIntent': (intent, session, response) => {
    response.ask('Event types are words such as start and end, and story IDs are numbers.' +
      'A sample input is as follows: \'add event start for story 19\'.');
  }
};

function validateEvent(eventType, callback) {
  const validEventTypes = require('./custom-slot-types').LIST_OF_EVENTS;
  if (validEventTypes.indexOf(eventType) < 0) {
    callback(`'${eventType}' is an invalid event type. Valid event types are: ${validEventTypes}`);
  } else {
    callback();
  }
}

function addEvent(eventType, intent, response) {
  const http = require('http');
  const moment = require('moment');

  const postData = JSON.stringify({
    eventType: eventType.replace(/ /g, '_'),
    occurredAt: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
    story: intent.slots.Number.value
  });

  const options = {
    hostname: 'fli-change.herokuapp.com',
    port: 80,
    path: '/events',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = http.request(options, (res) => {
    if (res.statusCode === 409) {
      response.tell('Sorry, your event already exists.');
    } else {
      response.tell('Event added successfully');
    }
  });

  req.on('error', () => {
    response.tell('Sorry, I was unable to add your event.');
  });

  req.write(postData);
  req.end();
}

exports.handler = function (event, context) {
  const fli = new Fli();
  fli.execute(event, context);
};
