const Alert = require("../models/Alert");

// Get all alerts
const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Alerts fetched successfully",
            count: alerts.length,
            alerts
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching alerts",
            error: error.message
        });
    }
};


// Get alerts for a specific vehicle
const getVehicleAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({
            vehicleId: req.params.vehicleId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Vehicle alerts fetched successfully",
            count: alerts.length,
            alerts
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching vehicle alerts",
            error: error.message
        });
    }
};


module.exports = {
    getAlerts,
    getVehicleAlerts
};