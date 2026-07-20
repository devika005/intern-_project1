const express = require("express");
const cors = require("cors");

const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Vehicle Routes
app.use("/api/vehicles", vehicleRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("FleetDash Backend is Running 🚚");
});

module.exports = app;