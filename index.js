const express = require("express");
const dotenv = require("dotenv");
dotenv.config();  // Keep this one

const mySqlPool = require("./config/db");

const app = express();

app.use(express.json());

// Routes
app.use('/api', require('./routes/schoolRoute'));
app.get('/test', (req, res) => {
    res.send("API is working!");
});

// Port from environment variables
const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Test database connection
        await mySqlPool.query('SELECT 1');
        console.log("MySQL DB connected");

        // Start server
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
};

startServer();
