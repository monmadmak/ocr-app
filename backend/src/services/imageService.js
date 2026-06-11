const sharp = require('sharp');

/**
 * ทำ Image Pre-processing ปรับแต่งค่าสีและความคมชัดของภาพสำหรับงาน OCR
 * @param {Buffer} buffer - Buffer ของไฟล์รูปภาพดิบ
 * @returns {Promise<Buffer>} - Buffer ของรูปภาพที่ปรับแต่งแล้ว
 */
async function preprocessImage(buffer) {
    return sharp(buffer)
        .grayscale() // แปลงเป็นโทนสีขาวเทาดำ (Grayscale)
        .normalize() // ปรับ Contrast ยืดขีดจำกัดสี
        .toBuffer();
}

module.exports = {
    preprocessImage
};
