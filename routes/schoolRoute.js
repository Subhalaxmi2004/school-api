const express = require("express");
const router = express.Router();
const { getSchool , createSchool } = require('../controllers/studentController');  

// Routes
router.get('/get', getSchool);
router.post('/create', createSchool);
module.exports = router;
