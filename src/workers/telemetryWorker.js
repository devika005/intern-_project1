const { parentPort } = require("worker_threads");

// Listen for data from the main thread
parentPort.on("message", (telemetryData) => {

    try {
        // Validate required fields
        if (!telemetryData.vehicleId) {
            throw new Error("vehicleId is required");
        }

        if (telemetryData.latitude === undefined) {
            throw new Error("latitude is required");
        }

        if (telemetryData.longitude === undefined) {
            throw new Error("longitude is required");
        }

        if (telemetryData.speed === undefined) {
            throw new Error("speed is required");
        }

        // Validate data types
        if (typeof telemetryData.vehicleId !== "string") {
            throw new Error("vehicleId must be a string");
        }

        if (typeof telemetryData.latitude !== "number") {
            throw new Error("latitude must be a number");
        }

        if (typeof telemetryData.longitude !== "number") {
            throw new Error("longitude must be a number");
        }

        if (typeof telemetryData.speed !== "number") {
            throw new Error("speed must be a number");
        }

        // Validate latitude range
        if (
            telemetryData.latitude < -90 ||
            telemetryData.latitude > 90
        ) {
            throw new Error(
                "latitude must be between -90 and 90"
            );
        }

        // Validate longitude range
        if (
            telemetryData.longitude < -180 ||
            telemetryData.longitude > 180
        ) {
            throw new Error(
                "longitude must be between -180 and 180"
            );
        }

        // Validate speed
        if (telemetryData.speed < 0) {
            throw new Error(
                "speed cannot be negative"
            );
        }

        // Process telemetry
        const processedData = {
            ...telemetryData,
            processed: true,
            processedAt: new Date()
        };

        // Send processed data back
        parentPort.postMessage({
            success: true,
            data: processedData
        });

    } catch (error) {

        // Send validation error back
        parentPort.postMessage({
            success: false,
            error: error.message
        });
    }
});