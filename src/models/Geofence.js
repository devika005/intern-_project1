const mongoose = require("mongoose");

const geofenceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        center: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },

        radius: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Geofence", geofenceSchema);
