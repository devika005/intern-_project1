const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        vehicleId: {
            type: String,
            required: true
        },

        geofenceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Geofence",
            required: true
        },

        geofenceName: {
            type: String,
            required: true
        },

        alertType: {
            type: String,
            required: true,
            default: "GEOFENCE_BREACH"
        },

        distance: {
            type: Number,
            required: true
        },

        radius: {
            type: Number,
            required: true
        },

        message: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Alert", alertSchema);