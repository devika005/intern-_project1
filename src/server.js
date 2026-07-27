require("dotenv").config();
const redisClient = require("./config/redis");
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();
redisClient.connect();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.io server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket connection
io.on("connection", (socket) => {
    console.log("✅ Client Connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Client Disconnected:", socket.id);
    });
});

// Make io available throughout the app
app.set("io", io);

// Start server
server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});