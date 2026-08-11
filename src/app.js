const express = require("express");
const cors = require("cors");

const vehicleRoutes = require("./routes/vehicleRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const geofenceRoutes = require("./routes/geofenceRoutes");
const alertRoutes = require("./routes/alertRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Vehicle Routes
app.use("/api/vehicles", vehicleRoutes);

// Telemetry Routes
app.use("/api/telemetry", telemetryRoutes);

// Geofence Routes
app.use("/api/geofences", geofenceRoutes);
app.use("/api/alerts", alertRoutes);
// Home Route
app.get("/", (req, res) => {
    res.send("FleetDash Backend is Running 🚚");
});

module.exports = app;