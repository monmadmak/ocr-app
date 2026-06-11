const { createWorker, createScheduler } = require('tesseract.js');
const path = require('path');

const scheduler = createScheduler();
let isReady = false;

// เริ่มต้นโหลดโมเดลและคนงานประมวลผล (Worker Pool) แบบคู่ขนาน
async function initScheduler() {
    try {
        const langPath = path.join(__dirname, '..', '..');
        const worker1 = await createWorker('tha+eng', 1, { langPath, cachePath: langPath });
        const worker2 = await createWorker('tha+eng', 1, { langPath, cachePath: langPath });
        
        scheduler.addWorker(worker1);
        scheduler.addWorker(worker2);
        
        isReady = true;
        console.log('🤖 [ocrService] Tesseract Scheduler initialized with 2 workers.');
    } catch (err) {
        console.error('❌ [ocrService] Failed to initialize Tesseract Scheduler:', err);
    }
}

initScheduler();

/**
 * ดึงข้อมูลข้อความจากรูปภาพด้วย Scheduler Pool
 * @param {Buffer} buffer - Buffer ของภาพที่ผ่าน Pre-processing
 * @returns {Promise<string>} - ข้อความที่สกัดได้
 */
async function recognizeText(buffer) {
    if (!isReady) {
        throw new Error('ระบบประมวลผล OCR ยังไม่พร้อมใช้งาน (กำลังเตรียมโมดูลภาษา)');
    }
    const { data: { text } } = await scheduler.addJob('recognize', buffer);
    return text.trim();
}

/**
 * ตรวจเช็กความพร้อมในการทำงาน
 */
function isReadyStatus() {
    return isReady;
}

module.exports = {
    recognizeText,
    isReadyStatus
};
