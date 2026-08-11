const TelemetryBucket = require("../models/TelemetryBucket");
const Geofence = require("../models/Geofence");
const Alert = require("../models/Alert");

const { Worker } = require("worker_threads");
const path = require("path");

const redisClient = require("../config/redis");
const { checkGeofence } = require("../services/geofenceService");


// ======================================
// ADD TELEMETRY
// ======================================

const addTelemetry = async (req, res) => {
    try {

        const worker = new Worker(
            path.join(__dirname, "../workers/telemetryWorker.js")
        );

        // Send telemetry data to worker
        worker.postMessage(req.body);

        // Receive result from worker
        worker.on("message", async (workerResult) => {

            // ======================================
            // HANDLE VALIDATION ERROR
            // ======================================

            if (!workerResult.success) {

                return res.status(400).json({
                    message: "Invalid telemetry data",
                    error: workerResult.error
                });
            }

            // Get processed telemetry
            const processedData = workerResult.data;

            try {

                const {
                    vehicleId,
                    latitude,
                    longitude,
                    speed
                } = processedData;


                // ======================================
                // MONGODB TELEMETRY BUCKET
                // ======================================

                let bucket = await TelemetryBucket.findOne({
                    vehicleId
                });

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


                // ======================================
                // GEOFENCE CHECK
                // ======================================

                const geofences = await Geofence.find();

                const geofenceResults = geofences.map(
                    (geofence) => {

                        const result = checkGeofence(
                            latitude,
                            longitude,
                            geofence
                        );

                        return {
                            geofenceId: geofence._id,
                            geofenceName: geofence.name,
                            ...result
                        };
                    }
                );


                // ======================================
                // GEOFENCE BREACH ALERT
                // ======================================

                for (const result of geofenceResults) {

                    if (!result.inside) {

                        const alert = {
                            vehicleId,
                            geofenceId: result.geofenceId,
                            geofenceName: result.geofenceName,
                            alertType: "GEOFENCE_BREACH",
                            distance: result.distance,
                            radius: result.radius,
                            message:
                                `Vehicle ${vehicleId} has left ${result.geofenceName}`
                        };

                        // Save alert
                        const savedAlert =
                            await Alert.create(alert);

                        console.log(
                            "🚨 GEOFENCE BREACH:",
                            savedAlert
                        );

                        // Send alert through Socket.io
                        const io = req.app.get("io");

                        if (io) {

                            io.emit(
                                "geofenceBreach",
                                savedAlert
                            );
                        }
                    }
                }


                // ======================================
                // REDIS CACHE
                // ======================================

                await redisClient.set(
                    `telemetry:${vehicleId}`,
                    JSON.stringify(processedData)
                );


                // ======================================
                // SOCKET.IO TELEMETRY UPDATE
                // ======================================

                const io = req.app.get("io");

                if (io) {

                    io.emit(
                        "telemetryUpdate",
                        processedData
                    );
                }


                // ======================================
                // RESPONSE
                // ======================================

                res.status(201).json({

                    message:
                        "Telemetry processed and stored successfully",

                    processedData,

                    bucket,

                    geofenceResults

                });

            } catch (error) {

                console.error(
                    "Telemetry processing error:",
                    error
                );

                res.status(500).json({

                    message:
                        "Error processing telemetry",

                    error:
                        error.message
                });
            }
        });


        // ======================================
        // WORKER ERROR
        // ======================================

        worker.on("error", (error) => {

            console.error(
                "Worker thread error:",
                error
            );

            res.status(500).json({

                message:
                    "Worker thread failed",

                error:
                    error.message
            });
        });


        // ======================================
        // WORKER EXIT
        // ======================================

        worker.on("exit", (code) => {

            if (code !== 0) {

                console.error(
                    `Worker stopped with exit code ${code}`
                );
            }
        });

    } catch (error) {

        res.status(500).json({

            message:
                "Error processing telemetry",

            error:
                error.message
        });
    }
};


// ======================================
// GET TELEMETRY FROM MONGODB
// ======================================

const getTelemetry = async (req, res) => {

    try {

        const bucket =
            await TelemetryBucket.findOne({
                vehicleId:
                    req.params.vehicleId
            });

        if (!bucket) {

            return res.status(404).json({

                message:
                    "Telemetry not found"
            });
        }

        res.status(200).json(bucket);

    } catch (error) {

        res.status(500).json({

            message:
                "Error fetching telemetry",

            error:
                error.message
        });
    }
};


// ======================================
// GET TELEMETRY FROM REDIS
// ======================================

const getCachedTelemetry = async (req, res) => {

    try {

        const vehicleId =
            req.params.vehicleId;

        const cachedData =
            await redisClient.get(
                `telemetry:${vehicleId}`
            );

        if (!cachedData) {

            return res.status(404).json({

                message:
                    "No cached telemetry found"
            });
        }

        res.status(200).json(
            JSON.parse(cachedData)
        );

    } catch (error) {

        res.status(500).json({

            message:
                "Error fetching cached telemetry",

            error:
                error.message
        });
    }
};


// ======================================
// EXPORT
// ======================================

module.exports = {
    addTelemetry,
    getTelemetry,
    getCachedTelemetry
};