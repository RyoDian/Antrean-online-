const express = require ('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const QueueController = require('../controlers/QueueController')

router.post('/queue/:location_id', authMiddleware , QueueController.createQueue )

module.exports = router;
