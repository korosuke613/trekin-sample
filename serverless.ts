import { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "trekin-sample-dev",
  },
  frameworkVersion: ">=1.72.0",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    region: "ap-northeast-1",
    runtime: "nodejs12.x",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    },
    logs: {
      restApi: {
        accessLogging: true,
      },
    },
  },
  functions: {
    webhook: {
      handler: "handler.webhook",
      events: [
        {
          http: {
            method: "post",
            path: "webhook",
          },
        },
        {
          http: {
            method: "head",
            path: "webhook",
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
