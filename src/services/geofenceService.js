const turf = require("@turf/turf");

const checkGeofence = (
    vehicleLatitude,
    vehicleLongitude,
    geofence
) => {

    const vehiclePoint = turf.point([
        vehicleLongitude,
        vehicleLatitude
    ]);

    const geofenceCenter = turf.point([
        geofence.center.longitude,
        geofence.center.latitude
    ]);

    const distance = turf.distance(
        vehiclePoint,
        geofenceCenter,
        {
            units: "kilometers"
        }
    );

    const radiusInKilometers = geofence.radius / 1000;

    const inside = distance <= radiusInKilometers;

    return {
        inside,
        distance: Number(distance.toFixed(2)),
        radius: Number(radiusInKilometers.toFixed(2))
    };
};

module.exports = {
    checkGeofence
};