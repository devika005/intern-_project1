const { parentPort } = require("worker_threads");

// Listen for data from the main thread
parentPort.on("message", (telemetryData) => {

    // Simulate processing
    const processedData = {
        ...telemetryData,
        processed: true,
        processedAt: new Date()
    };

    // Send processed data back
    parentPort.postMessage(processedData);
});