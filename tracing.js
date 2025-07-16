"use strict";

const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

// configuring OpenTelemetry sdk
const sdk = new NodeSDK({
  serviceName: "get-date",
  traceExporter: new ZipkinExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
