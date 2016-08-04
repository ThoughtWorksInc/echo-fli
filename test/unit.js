'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const sut = require('../functions/index');

describe('Lambda handler', function () {
  let fliBackend;

  beforeEach(function () {
    fliBackend = nock('http://fli-change.herokuapp.com')
      .post('/events')
      .reply(200);
  });

  afterEach(function () {
    nock.cleanAll();
  });

  it('should successfully handle launch request', function (done) {
    const event = {
      session: {},
      version: '1.0',
      request: {'type': 'LaunchRequest'}
    };

    sut.handler(event, {
      succeed: function (response) {
        expect(response.response.outputSpeech.text).to.equal('Let\'s fly!');
        expect(fliBackend.isDone()).to.be.false;
        done();
      }
    });
  });

  it('should successfully handle intent request', function (done) {
    const event = {
      session: {},
      version: '1.0',
      request: {
        type: 'IntentRequest',
        intent: {
          name: 'FliIntent',
          slots: {
            Number: {
              name: 'Number',
              value: '1'
            },
            Event: {
              name: 'Event',
              value: 'start'
            }
          }
        }
      }
    };

    sut.handler(event, {
      succeed: function (response) {
        expect(response.response.outputSpeech.text).to.equal('Event added successfully');
        expect(fliBackend.isDone()).to.be.true;
        done();
      }
    });
  });
});
