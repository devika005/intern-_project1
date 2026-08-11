const express = require("express");

const router = express.Router();

const {
    createGeofence,
    getGeofences
} = require("../controllers/geofenceController");


router.post("/", createGeofence);

router.get("/", getGeofences);


module.exports = router;