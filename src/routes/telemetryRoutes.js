const express = require("express");
const router = express.Router();

const {
    addTelemetry,
    getTelemetry
} = require("../controllers/telemetryController");

// Add telemetry
router.post("/", addTelemetry);

// Get telemetry by vehicle ID
router.get("/:vehicleId", getTelemetry);

module.exports = router;