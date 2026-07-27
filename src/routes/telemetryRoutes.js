const express = require("express");
const router = express.Router();

const {
    addTelemetry,
    getTelemetry,
    getCachedTelemetry
} = require("../controllers/telemetryController");

router.post("/", addTelemetry);

router.get("/cache/:vehicleId", getCachedTelemetry);

router.get("/:vehicleId", getTelemetry);

module.exports = router;