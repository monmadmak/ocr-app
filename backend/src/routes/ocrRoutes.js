const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const ocrController = require('../controllers/ocrController');

// API Endpoint สำหรับทำ OCR: POST /api/v1/ocr
router.post('/ocr', upload.any(), ocrController.processOCR);

module.exports = router;
