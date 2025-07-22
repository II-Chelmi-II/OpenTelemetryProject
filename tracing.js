"use strict";

const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

function initTracing() {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  const serviceName = process.env.OTEL_SERVICE_NAME || "get-date";
  const zipkinUrl =
    process.env.ZIPKIN_URL || "http://localhost:9411/api/v2/spans";

  const sdk = new NodeSDK({
    serviceName,
    traceExporter: new ZipkinExporter({ url: zipkinUrl }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  try {
    sdk.start();
    console.log(
      `[Tracing] OpenTelemetry tracing initialized for service "${serviceName}" (Zipkin: ${zipkinUrl})`,
    );
  } catch (err) {
    console.error("[Tracing] Error initializing OpenTelemetry tracing:", err);
  }
}

module.exports = { initTracing };
