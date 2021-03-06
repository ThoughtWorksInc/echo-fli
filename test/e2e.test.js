'use strict';

const expect = require('chai').expect;
const AWS = require('aws-sdk');
const restify = require('restify');
const conf = require('../functions/config');
const intentEventFactory = require('./intent-event-factory');

// TODO: Create a 'delete story' route in fli so that we can start from a clean slate for each test.
it('Lambda event should be persisted to FLI backend database', function (done) {

  this.timeout(6000);

  // Given
  const storyNumber = '1234567890';
  const lambda = new AWS.Lambda({region: 'us-east-1'});
  const jsonClient = restify.createJsonClient({
    url: `http://${conf.hostname}`,
    connectTimeout: 2000,
    requestTimeout: 2000
  });

  jsonClient.get(`/stories/${storyNumber}`, function (err, data) {
    assertNoError(err);
    expect(err).to.eql(null);
    const initialResponse = JSON.parse(data.res.body);
    const initialNumberOfEvents = initialResponse.story.events.length;
    const params = {
      FunctionName: require('../package.json').name,
      Payload: JSON.stringify(intentEventFactory.create('kickoff', storyNumber))
    };

    // When
    lambda.invoke(params, function (err, data) {

      // Then
      assertNoError(err);
      expect(data.StatusCode).to.equal(200);
      expect(data.FunctionError).to.be.undefined;
      expect(JSON.parse(data.Payload).response.outputSpeech.text).to.equal('Event added successfully');
      jsonClient.get(`/stories/${storyNumber}`, function (err, data) {
        assertNoError(err);
        const finalResponse = JSON.parse(data.res.body);
        expect(finalResponse.story.events.length).to.equal(initialNumberOfEvents + 1);
        done();
      });
    });
  });

  function assertNoError(err) {
    if (err) {
      if (typeof err === 'string') {
        err = JSON.parse(err);
      }

      const assert = require('chai').assert;
      assert.fail(null, null, JSON.stringify(err, null, 2));
    }
  }
});
