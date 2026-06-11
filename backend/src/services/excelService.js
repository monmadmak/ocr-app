const ExcelJS = require('exceljs');

/**
 * สร้างไฟล์ Excel ในรูปแบบ Binary Buffer จากข้อมูล OCR ผลลัพธ์
 * @param {Array} ocrResults - ข้อมูลผลลัพธ์ OCR
 * @returns {Promise<Buffer>} - Excel file binary buffer
 */
async function generateExcelBuffer(ocrResults) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('OCR Results');
    
    // กำหนดโครงสร้างคอลัมน์และหัวตาราง (Headers)
    worksheet.columns = [
        { header: 'ชื่อไฟล์รูปภาพ (Filename)', key: 'filename', width: 30 },
        { header: 'สถานะการประมวลผล (Status)', key: 'status', width: 20 },
        { header: 'ข้อความที่ดึงข้อมูลได้ (Extracted Text)', key: 'text', width: 60 }
    ];

    // ปรับแต่งดีไซน์หัวตารางให้พรีเมียม (Teal-600 สีเดียวกับแอปพลิเคชัน)
    const headerRow = worksheet.getRow(1);
    headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0D9488' } // สี Teal-600
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
    headerRow.height = 24;

    // เพิ่มแถวรายการข้อมูลลงชีต Excel
    ocrResults.forEach(result => {
        const row = worksheet.addRow({
            filename: result.filename,
            status: result.status === 'success' ? 'สำเร็จ (Success)' : 'เกิดข้อผิดพลาด (Error)',
            text: result.text || result.message || ''
        });

        // จัดการให้ข้อความเว้นบรรทัดขึ้นบรรทัดใหม่ได้ในเซลล์ (Word Wrap)
        row.alignment = { vertical: 'top', wrapText: true };
    });

    // เขียนข้อมูลออกมาในรูปแบบ Binary Buffer ในหน่วยความจำโดยตรง
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

module.exports = {
    generateExcelBuffer
};
