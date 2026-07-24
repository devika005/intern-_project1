const TelemetryBucket = require("../models/TelemetryBucket");
const { Worker } = require("worker_threads");
const path = require("path");

// Add telemetry using Worker Thread
const addTelemetry = async (req, res) => {
    try {
        const worker = new Worker(
            path.join(__dirname, "../workers/telemetryWorker.js")
        );

        // Send request data to worker
        worker.postMessage(req.body);

        // Receive processed data from worker
        worker.on("message", async (processedData) => {
            try {
                const { vehicleId, latitude, longitude, speed } = processedData;

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
                    message: "Telemetry processed and stored successfully",
                    processedData,
                    bucket
                });
            } catch (error) {
                res.status(500).json({
                    message: "Database error",
                    error: error.message
                });
            }
        });

        worker.on("error", (error) => {
            res.status(500).json({
                message: "Worker thread failed",
                error: error.message
            });
        });

        worker.on("exit", (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error processing telemetry",
            error: error.message
        });
    }
};

// Get telemetry by vehicle ID
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