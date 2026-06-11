const multer = require('multer');
const path = require('path');

// กรองประเภทไฟล์
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('อนุญาตเฉพาะไฟล์ .png, .jpg และ .jpeg เท่านั้น!'), false);
    }
};

// ตั้งค่าเก็บไฟล์ในหน่วยความจำ (Memory Storage) 100% ป้องกันคอขวด Disk I/O และไฟล์ชั่วคราวตกค้างบนระบบ
const upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // จำกัดขนาดไฟล์ที่ 10MB
});

module.exports = upload;
