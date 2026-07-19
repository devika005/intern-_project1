const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    speed: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const telemetryBucketSchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        required: true
    },
    records: [telemetrySchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("TelemetryBucket", telemetryBucketSchema);