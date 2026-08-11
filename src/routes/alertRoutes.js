const express = require("express");

const router = express.Router();

const {
    getAlerts,
    getVehicleAlerts
} = require("../controllers/alertController");


// Get all alerts
router.get("/", getAlerts);


// Get alerts for a specific vehicle
router.get("/:vehicleId", getVehicleAlerts);


module.exports = router;