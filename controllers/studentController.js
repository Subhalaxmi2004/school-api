const db = require("../config/db");


const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; //radius of earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
};


const getSchool = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        if (latitude && longitude) {
            
            const userLat = parseFloat(latitude);
            const userLon = parseFloat(longitude);

            if (isNaN(userLat) || isNaN(userLon)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid latitude or longitude",
                });
            }

            
            const [rows] = await db.query('SELECT * FROM school');

            // Calculate distance for each school and sort by distance
            const schoolsWithDistance = rows.map(school => {
                const distance = haversineDistance(userLat, userLon, school.latitude, school.longitude);
                return { ...school, distance };
            }).sort((a, b) => a.distance - b.distance);

            return res.status(200).json({
                success: true,
                message: "Nearby schools sorted by distance",
                data: schoolsWithDistance,
            });
        } else {
            // If latitude and longitude are not provided, return all schools
            const [rows] = await db.query('SELECT * FROM school');
            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No records found",
                });
            }
            return res.status(200).json({
                success: true,
                message: "All school records",
                data: rows
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error in getting all schools",
            error: err.message
        });
    }
}
const createSchool = async (req, res) => {
    try {
        const { id, name, address, latitude, longitude } = req.body;

        
        console.log("Received data:", { id, name, address, latitude, longitude });

        // validate all fields
        if (!id || !name || !address || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Validate field types
        if (typeof name !== 'string' || typeof address !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Name and address must be strings",
            });
        }

       
        const parsedLatitude = parseFloat(latitude);
        const parsedLongitude = parseFloat(longitude);

        // Validate latitude and longitude
        if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude must be valid numbers",
            });
        }

       
        if (parsedLatitude < -90 || parsedLatitude > 90 || parsedLongitude < -180 || parsedLongitude > 180) {
            return res.status(400).json({
                success: false,
                message: "Latitude must be between -90 and 90, and longitude must be between -180 and 180",
            });
        }
        // Check for existing id
        const [existingSchool] = await db.query('SELECT * FROM school WHERE id = ?', [id]);

        if (existingSchool.length > 0) {
            return res.status(400).json({
                success: false,
                message: "A school with this ID already exists",
            });
        }

       
        const [result] = await db.query('INSERT INTO school (id, name, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)', 
        [id, name, address, parsedLatitude, parsedLongitude]);

        
        if (result.affectedRows === 0) {
            return res.status(500).json({
                success: false,
                message: "Error inserting new school",
            });
        }

       
        return res.status(201).json({
            success: true,
            message: "New school created successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error in creating school",
            error: err.message
        });
    }
};

module.exports = { getSchool,createSchool };