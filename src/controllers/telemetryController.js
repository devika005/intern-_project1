const TelemetryBucket = require("../models/TelemetryBucket");

// Add telemetry data
const addTelemetry = async (req, res) => {
    try {
        const { vehicleId, latitude, longitude, speed } = req.body;

        let bucket = await TelemetryBucket.findOne({ vehicleId });

        if (!bucket) {
            bucket = new TelemetryBucket({
                vehicleId,
                records: []
            });
        }

        bucket.records.push({
            latitude,
            longitude,
            speed,
            timestamp: new Date()
        });

        await bucket.save();

        res.status(201).json({
            message: "Telemetry added successfully",
            bucket
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding telemetry",
            error: error.message
        });
    }
};

// Get telemetry for a vehicle
const getTelemetry = async (req, res) => {
    try {
        const bucket = await TelemetryBucket.findOne({
            vehicleId: req.params.vehicleId
        });

        if (!bucket) {
            return res.status(404).json({
                message: "Telemetry not found"
            });
        }

        res.status(200).json(bucket);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching telemetry",
            error: error.message
        });
    }
};

module.exports = {
    addTelemetry,
    getTelemetry
};