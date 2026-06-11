const ocrService = require('../services/ocrService');
const imageService = require('../services/imageService');
const excelService = require('../services/excelService');

const processOCR = async (req, res, next) => {
    // 1. ตรวจสอบสถานะความพร้อมของ OCR Service
    if (!ocrService.isReadyStatus()) {
        return res.status(503).json({
            status: 'error',
            message: 'เซิร์ฟเวอร์ยังไม่พร้อมประมวลผล OCR กรุณาลองใหม่อีกครั้งในภายหลัง (กำลังเตรียมโมดูลภาษา)'
        });
    }

    // 2. ตรวจสอบว่ามีไฟล์ส่งมาหรือไม่
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'ไม่พบไฟล์รูปภาพ หรือรูปแบบไฟล์ไม่ถูกต้อง (รองรับ jpeg, png)'
        });
    }

    // 3. จำกัดความปลอดภัยในการสแกนสูงสุด 10 รูป
    if (req.files.length > 10) {
        return res.status(400).json({
            status: 'error',
            message: 'จำกัดการอัปโหลดสูงสุด 10 ไฟล์พร้อมกัน'
        });
    }

    try {
        console.log(`[START] [ocrController] ประมวลผลจำนวน: ${req.files.length} รูป`);

        // 4. สั่งทำ Image Pre-processing และประมวลผล OCR
        const ocrPromises = req.files.map(async (file) => {
            try {
                // เรียกใช้ Image Service (Pre-processing ใน Memory)
                const processedImage = await imageService.preprocessImage(file.buffer);

                // เรียกใช้ OCR Service (Tesseract.js Scheduler Pool)
                const text = await ocrService.recognizeText(processedImage);

                return {
                    filename: file.originalname,
                    status: 'success',
                    text: text
                };
            } catch (err) {
                console.error(`[ERROR] [ocrController] ไฟล์ ${file.originalname} เกิดข้อผิดพลาด:`, err);
                return {
                    filename: file.originalname,
                    status: 'error',
                    message: err.message
                };
            }
        });

        const results = await Promise.all(ocrPromises);

        // 5. จัดการส่งข้อมูลตามฟอร์แมตที่เรียกขอ (เช่น Excel หรือ JSON)
        const format = req.query.format;
        
        if (format === 'excel') {
            const excelBuffer = await excelService.generateExcelBuffer(results);
            
            // กำหนด Headers สำหรับการดาวน์โหลดเอกสาร Excel
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=ocr-results.xlsx');
            
            return res.send(excelBuffer);
        }

        // ส่ง Response กลับในรูปแบบ JSON ปกติ
        return res.status(200).json({
            status: 'success',
            results: results
        });

    } catch (error) {
        // ส่งต่อข้อผิดพลาดร้ายแรงไปที่ Express Global Error Handler
        next(error);
    }
};

module.exports = {
    processOCR
};
