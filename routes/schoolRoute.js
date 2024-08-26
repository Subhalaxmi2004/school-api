const express = require("express");
const router = express.Router();
const { getSchool , createSchool } = require('../controllers/studentController');  

// Routes
router.get('/listSchool', getSchool);
router.post('/addSchool', createSchool);
module.exports = router;
