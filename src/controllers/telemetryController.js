const TelemetryBucket = require("../models/TelemetryBucket");
const { Worker } = require("worker_threads");
const path = require("path");
const redisClient = require("../config/redis");

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

await redisClient.set(
    `telemetry:${vehicleId}`,
    JSON.stringify(processedData)
);

const io = req.app.get("io");
io.emit("telemetryUpdate", processedData);

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
// Get latest telemetry from Redis cache
const getCachedTelemetry = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;

        const cachedData = await redisClient.get(`telemetry:${vehicleId}`);

        if (!cachedData) {
            return res.status(404).json({
                message: "No cached telemetry found"
            });
        }

        res.status(200).json(JSON.parse(cachedData));

    } catch (error) {
        res.status(500).json({
            message: "Error fetching cached telemetry",
            error: error.message
        });
    }
};
module.exports = {
    addTelemetry,
    getTelemetry,
    getCachedTelemetry
};