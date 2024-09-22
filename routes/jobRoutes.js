const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/schedule', authMiddleware,jobController.createJob);
router.post('/stop',authMiddleware, jobController.stopJob);
router.get('/jobs', authMiddleware, jobController.getAllJobsForUser);
module.exports = router;
