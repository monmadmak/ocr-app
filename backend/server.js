const express = require('express');
const cors = require('cors');
const ocrRoutes = require('./src/routes/ocrRoutes');

const app = express();
const port = process.env.PORT || 3000;

// ตั้งค่าระบุ CORS Origin ที่ได้รับอนุญาต (ข้ามพอร์ตและระบบแปรผันตาม Env)
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // อนุญาตถ้ารายการตรง หรือเมื่อไม่มี origin (เช่น curl หรือเครื่องมือภายนอก)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('ไม่อนุญาตการเชื่อมต่อจาก Origin นี้โดยนโยบาย CORS'));
        }
    },
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// เรียกใช้งาน OCR Routes
app.use('/api/v1', ocrRoutes);

// Global Error Handler Middleware
// ดักจับข้อผิดพลาดทั้งหมดที่เกิดขึ้นในระบบ (เช่น CORS Error หรือ Multer Error) และส่งกลับเป็นรูปแบบ JSON ป้องกัน HTML Stack Trace หลุดไปหน้าบ้าน
app.use((err, req, res, next) => {
    console.error('❌ [SERVER ERROR]:', err);

    // ดักจับกรณี Multer Error
    if (err.code && err.code.startsWith('LIMIT_')) {
        return res.status(400).json({
            status: 'error',
            message: `ข้อผิดพลาดในการอัปโหลดไฟล์: ${err.message} (จำกัดขนาดไม่เกิน 10MB และอัปโหลดได้สูงสุด 10 รูป)`
        });
    }

    // ดักจับ CORS หรือ Error ทั่วไป
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    return res.status(statusCode).json({
        status: 'error',
        message: err.message || 'เกิดข้อผิดพลาดร้ายแรงภายในระบบเซิร์ฟเวอร์'
    });
});

// เริ่มทำงาน Web Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`🎯 API Endpoint: POST http://localhost:${port}/api/v1/ocr`);
});
