const expect = require('chai').expect;
const AWS = require('aws-sdk');

it('Lambda should be successfully deployed in AWS', function (done) {
  this.timeout(5000);
  const lambda = new AWS.Lambda({region: 'us-east-1'});
  const params = {
    FunctionName: require('../package.json').name,
    Payload: `{
        "session": {},
        "version": "1.0",
        "request": { "type": "LaunchRequest" }
      }`
  };

  lambda.invoke(params, function (err, data) {
    expect(err).to.eql(null);
    expect(data.StatusCode).to.equal(200);
    expect(data.FunctionError).to.be.undefined;
    expect(JSON.parse(data.Payload).response.outputSpeech.text).to.equal('Let\'s fly!');
    done();
  });
});
