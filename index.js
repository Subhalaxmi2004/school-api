const express = require("express");
const dotenv = require("dotenv");
const mySqlPool = require("./config/db");

dotenv.config();


const app = express();

app.use(express.json());

// Routes
app.use('/api', require('./routes/schoolRoute'));
app.get('/test', (req, res) => {
    res.send("API is working!");
});

// Port
const port = 8080;

const startServer = async () => {
    try {
        await mySqlPool.query('SELECT 1');
        console.log("MySQL DB conncted");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Error connecting to the database:", err);
    }
};

startServer();


