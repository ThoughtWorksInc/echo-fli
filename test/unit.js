'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const intentEventFactory = require('./intent-event-factory');
const sut = require('../functions/index');

const assert = require('chai').assert;
function fail(done) {
  return function(err) {
    assert.fail(null, null, `Lambda failed: ${err}`);
    done();
  };
}

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
      },
      fail: fail(done)
    });
  });

  it('should successfully handle valid intent request', function (done) {
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

  it('should successfully handle invalid intent request', function (done) {
    const event = intentEventFactory.create('invalid-event');

    sut.handler(event, {
      succeed: function (response) {
        expect(response.response.outputSpeech.text).to.contain('is an invalid event type');
        done();
      },
      fail: fail(done)
    });
  });
});
