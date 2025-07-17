"use strict";

const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const {
  MeterProvider,
  PeriodicExportingMetricReader,
} = require("@opentelemetry/sdk-metrics");

// creating Exporter
const exporter = new PrometheusExporter(
  {
    port: 9464,
    preventServerStart: false,
  },
  () => {
    console.log(
      `Prometheus metrics available at http://localhost:9464/metrics`,
    );
  },
);

// creating MetricReader
const metricReader = new PeriodicExportingMetricReader({
  exporter: exporter,
  exportIntervalMillis: 1000,
});

// creating MetricProvider with reader
const meterProvider = new MeterProvider({
  readers: [metricReader],
});

const meter = meterProvider.getMeter("app-meter");

const requestCount = meter.createCounter("http_requests", {
  description: "Count of HTTP requests",
  unit: "1",
});

// middleware exportation
module.exports.countAllRequests = () => {
  return (req, res, next) => {
    requestCount.add(1, {
      route: req.path,
      method: req.method,
      status_code: res.statusCode,
    });
    next();
  };
};

process.on("unhandledRejection", (err) => {
  console.error("Metrics setup error:", err);
});
