const { initTracing } = require("./tracing");
initTracing();

const PORT = process.env.PORT || "8080";
const express = require("express");
const { countAllRequests } = require("./monitoring");
const { default: axios } = require("axios");
const app = express();

app.use(countAllRequests());

app.get("/middle-tier", (req, res) => {
  axios
    .get(`http://localhost:${PORT}/backend`)
    .then((result) => {
      res.send(result.data);
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/backend", (req, res) => {
  res.json({ message: "hello from backend" });
});

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
