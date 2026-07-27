const { createClient } = require("redis");

const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.on("connect", () => {
    console.log("✅ Redis Connected Successfully");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Connection Error:", err.message);
});

module.exports = redisClient;