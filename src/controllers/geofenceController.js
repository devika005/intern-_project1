const Geofence = require("../models/Geofence");

// Create a new geofence
const createGeofence = async (req, res) => {
    try {
        const { name, center, radius } = req.body;

        const geofence = new Geofence({
            name,
            center,
            radius
        });

        await geofence.save();

        res.status(201).json({
            message: "Geofence created successfully",
            geofence
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating geofence",
            error: error.message
        });
    }
};


// Get all geofences
const getGeofences = async (req, res) => {
    try {
        const geofences = await Geofence.find();

        res.status(200).json(geofences);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching geofences",
            error: error.message
        });
    }
};


module.exports = {
    createGeofence,
    getGeofences
};