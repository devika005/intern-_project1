const Vehicle = require("../models/Vehicle");

// Get all vehicles
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching vehicles",
            error: error.message
        });
    }
};

// Add a new vehicle
const addVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();

        res.status(201).json({
            message: "Vehicle added successfully",
            vehicle
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding vehicle",
            error: error.message
        });
    }
};

module.exports = {
    getVehicles,
    addVehicle
};