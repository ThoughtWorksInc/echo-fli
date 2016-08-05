'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const intentEventFactory = require('./intent-event-factory');
const conf = require('../functions/config');
const sut = require('../functions/index');

const assert = require('chai').assert;
function fail(done) {
  return function (err) {
    assert.fail(null, null, `Lambda failed: ${err}`);
    done();
  };
}

describe('Lambda', function () {
  let fliBackend;

  beforeEach(function () {
    fliBackend = nock(`http://${conf.hostname}`)
      .post('/events')
      .reply(200);
  });

  afterEach(function () {
    nock.cleanAll();
  });

  it('should respond to launch request', function (done) {
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
      },
      fail: fail(done)
    });
  });

  it('should persist and respond to intent request', function (done) {
    const event = intentEventFactory.create('start');

    sut.handler(event, {
      succeed: function (response) {
        expect(response.response.outputSpeech.text).to.equal('Event added successfully');
        expect(fliBackend.isDone()).to.be.true;
        done();
      },
      fail: fail(done)
    });
  });

  describe('should respond (without persisting) to invalid intent request', function () {

    it('when event type is invalid', function (done) {
      const event = intentEventFactory.create('invalid-event');

      sut.handler(event, {
        succeed: function (response) {
          expect(response.response.outputSpeech.text).to.contain('is an invalid event type');
          done();
        },
        fail: fail(done)
      });
    });

    it('when story number is invalid', function (done) {
      const event = intentEventFactory.create('start', '?');

      sut.handler(event, {
        succeed: function (response) {
          expect(response.response.outputSpeech.text).to.contain('story number must be an integer');
          done();
        },
        fail: fail(done)
      });
    });

  });
});
