'use strict';

const expect = require('chai').expect;
const AWS = require('aws-sdk');
const restify = require('restify');
const conf = require('../functions/config');
const intentEventFactory = require('./intent-event-factory');

// TODO: Create a 'delete story' route in fli so that we can start from a clean slate for each test.
it.only('Lambda event should be persisted to FLI backend database', function (done) {

  this.timeout(5000);

  // Given
  const storyNumber = '1234567890';
  const lambda = new AWS.Lambda({region: 'us-east-1'});
  const jsonClient = restify.createJsonClient({
    url: `http://${conf.hostname}`,
    connectTimeout: 1000,
    requestTimeout: 1000
  });

  jsonClient.get(`/stories/${storyNumber}`, function (err, data) {
    let responseBody = JSON.parse(data.res.body);
    const initialNumberOfEvents = responseBody.story.events.length;
    const params = {
      FunctionName: require('../package.json').name,
      Payload: JSON.stringify(intentEventFactory.create('kickoff', storyNumber))
    };

    // When
    lambda.invoke(params, function (err, data) {

      // Then
      expect(err).to.eql(null);
      expect(data.StatusCode).to.equal(200);
      expect(data.FunctionError).to.be.undefined;
      expect(JSON.parse(data.Payload).response.outputSpeech.text).to.equal('Event added successfully');
      jsonClient.get(`/stories/${storyNumber}`, function (err, data) {
        expect(err).to.eql(null);
        responseBody = JSON.parse(data.res.body);
        expect(responseBody.story.events.length).to.equal(initialNumberOfEvents + 1);
        done();
      });
    });
  });

});
