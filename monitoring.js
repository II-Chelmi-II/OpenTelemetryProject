"use strict";

const { PrometheusExporter } = require("@opentelemetry/exporter-prometheus");
const { MeterProvider } = require("@opentelemetry/sdk-metrics");
const { resourceFromAttributes } = require("@opentelemetry/resources");

// create PrometheusExporter and use it as a reader
const prometheusExporter = new PrometheusExporter(
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

const meterProvider = new MeterProvider({
  readers: [prometheusExporter],
  resource: resourceFromAttributes({
    "service.name": process.env.OTEL_SERVICE_NAME || "get-date",
  }),
});

const meter = meterProvider.getMeter("app-meter");

const requestCount = meter.createCounter("http_requests", {
  description: "Count of HTTP requests",
  unit: "1",
});

// middleware exportation
module.exports.countAllRequests = () => {
  return (req, res, next) => {
    res.on("finish", () => {
      requestCount.add(1, {
        route: req.path,
        method: req.method,
        status_code: res.statusCode,
      });
    });
    next();
  };
};

process.on("unhandledRejection", (err) => {
  console.error("Metrics setup error:", err);
});
