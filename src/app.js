const express = require("express");
const cors = require("cors");

const vehicleRoutes = require("./routes/vehicleRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");



const app = express();

app.use(cors());
app.use(express.json());

// Vehicle Routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/telemetry", telemetryRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("FleetDash Backend is Running 🚚");
});

module.exports = app;