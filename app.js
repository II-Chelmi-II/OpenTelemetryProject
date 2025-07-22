const { initTracing } = require("./tracing");
initTracing();

const PORT = process.env.PORT || "8080";
const express = require("express");
const { countAllRequests } = require("./monitoring");
const app = express();

app.use(countAllRequests());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/date", (req, res) => {
  res.json({ today: new Date().toISOString() });
});

// Error handling middleware for observability
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
