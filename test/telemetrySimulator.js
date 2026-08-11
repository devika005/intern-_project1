const axios = require("axios");

const vehicles = [];

for (let i = 1; i <= 100; i++) {
    vehicles.push(`TRK${String(i).padStart(3, "0")}`);
}

const sendTelemetry = async (vehicleId) => {
    const telemetry = {
        vehicleId,
        latitude: 11 + Math.random() * 0.2,
        longitude: 76.9 + Math.random() * 0.3,
        speed: Math.floor(Math.random() * 80) + 20
    };

    try {
        const response = await axios.post(
            "http://localhost:5000/api/telemetry",
            telemetry
        );

        return {
            vehicleId,
            status: response.status
        };

    } catch (error) {
        return {
            vehicleId,
            status: error.response?.status || "ERROR",
            error: error.response?.data || error.message
        };
    }
};

const runSimulation = async () => {
    console.log("🚚 Starting 100-vehicle simulation...");

    const startTime = Date.now();

    const results = await Promise.all(
        vehicles.map((vehicleId) =>
            sendTelemetry(vehicleId)
        )
    );

    const endTime = Date.now();

    const successful = results.filter(
        result => result.status === 201
    );

    const failed = results.filter(
        result => result.status !== 201
    );

    console.log("\n========== SIMULATION RESULT ==========");
    console.log(`Total vehicles: ${vehicles.length}`);
    console.log(`Successful: ${successful.length}`);
    console.log(`Failed: ${failed.length}`);
    console.log(`Time taken: ${endTime - startTime} ms`);
    console.log("=======================================\n");
};

runSimulation();