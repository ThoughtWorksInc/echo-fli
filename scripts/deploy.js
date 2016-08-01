(function deploy() {
  const artifact = process.argv[2];
  const conf = {
    region: 'us-east-1',
    handler: 'index.handler',
    role: 'arn:aws:iam::012522134436:role/lambda_basic_execution',
    functionName: require('../functions/package.json').name,
    publish: true,
    runtime: 'nodejs4.3'
  };

  const awsLambda = require("node-aws-lambda");
  awsLambda.deploy(artifact, conf, function (err) {
    if (err) {
      console.log(err);
      process.exitCode = 1;
    }
  });
})();
