"use strict";

const { MeterProvider } = require("@opentelemetry/sdk-metrics");

// creating a MeterProvider and getting a meter instance
const meterProvider = new MeterProvider();
const meter = meterProvider.getMeter("your-meter-name");

// creating a counter instrument
const requestCount = meter.createCounter("requests", {
  description: "Count all incoming HTTP requests",
});

// exporting a middleware function to count requests by route
module.exports.countAllRequests = () => {
  return (req, res, next) => {
    requestCount.add(1, {
      route: req.path,
    });
    next();
  };
};
