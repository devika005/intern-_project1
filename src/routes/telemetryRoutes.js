const express = require("express");
const router = express.Router();

const {
    addTelemetry,
    getTelemetry
} = require("../controllers/telemetryController");

// POST /api/telemetry
router.post("/", addTelemetry);

// GET /api/telemetry/:vehicleId
router.get("/:vehicleId", getTelemetry);

module.exports = router;