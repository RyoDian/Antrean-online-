const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const authRole = require('../middleware/authRole');
const router = express.Router();
const ServiceController = require('../controlers/ServiceController'); // Pastikan import benar

// Rute untuk Service
router.post('/service', authMiddleware, authRole(['super-admin']), ServiceController.createService);
router.put('/service/:id', authMiddleware, authRole(['super-admin']), ServiceController.updateService);
router.delete('/service/:id', authMiddleware, authRole(['super-admin']), ServiceController.deleteService);

module.exports = router;
