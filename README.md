# OCR Application 🚀

ระบบเว็บแอปพลิเคชันสำหรับแปลงข้อความจากรูปภาพ (Optical Character Recognition - OCR) รองรับภาษาไทยและภาษาอังกฤษ สามารถอัปโหลดรูปภาพพร้อมกันได้หลายรูป พรีวิวผลลัพธ์ และดาวน์โหลดผลลัพธ์ทั้งหมดออกมาเป็นไฟล์ Excel ได้อย่างสะดวก

---

## 🛠️ Tech Stack

### Frontend
- **Next.js** (React, TypeScript)
- **Tailwind CSS** สำหรับการตกแต่งหน้าตาแอปพลิเคชัน
- สถาปัตยกรรมแบบ Component-based สะอาด และตอบสนองรวดเร็ว (Responsive Design)

### Backend
- **Node.js** (Express)
- **Tesseract.js** สำหรับการประมวลผล OCR (รองรับทั้ง Model ภาษาไทย `tha` และภาษาอังกฤษ `eng`)
- **Sharp** สำหรับการประมวลผลและลดขนาดภาพก่อนทำ OCR เพื่อความแม่นยำและรวดเร็ว
- **ExcelJS** สำหรับการจัดทำโครงสร้างและ Export ผลลัพธ์เป็นไฟล์ Excel (.xlsx)
- **Multer** สำหรับจัดการการอัปโหลดไฟล์รูปภาพอย่างปลอดภัย

---

## ✨ คุณสมบัติหลัก (Features)

- 📸 **Batch Upload:** อัปโหลดไฟล์รูปภาพ (JPG, PNG, WebP ฯลฯ) พร้อมกันได้สูงสุด 10 รูป (ขนาดไม่เกิน 10MB ต่อไฟล์)
- 🌐 **Multi-language OCR:** รองรับการทำ OCR ทั้งข้อความภาษาไทยและภาษาอังกฤษ
- ⚡ **Real-time Progress:** แสดงสถานะการประมวลผลของแต่ละไฟล์แบบ Real-time (Waiting, Processing, Completed)
- 📝 **Live Preview & Editor:** สามารถพรีวิวผลลัพธ์ข้อความที่แกะออกมาได้ทันที และสลับดูของแต่ละรูปภาพได้ง่ายดาย
- 📊 **Excel Export:** รวมผลลัพธ์การแปลงข้อความจากทุกรูปภาพและดาวน์โหลดเป็นไฟล์ Excel ในคลิกเดียว
- ⚙️ **Configurable Endpoint:** สามารถเข้าไปปรับเปลี่ยน URL ของ API Endpoint ในหน้าเว็บได้โดยตรงหากเซิร์ฟเวอร์เปลี่ยนพอร์ต

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
OCR/
├── backend/            # Express API Server
│   ├── src/
│   │   ├── controllers/  # จัดการ Logic Request/Response
│   │   ├── middlewares/  # จัดการอัปโหลดรูปภาพด้วย Multer
│   │   ├── routes/       # จัดการเส้นทาง API Endpoints
│   │   └── services/     # บริการทำ OCR, แต่งรูปภาพ (Sharp), และสร้าง Excel
│   ├── server.js         # จุดเริ่มต้นรัน Backend
│   └── package.json
│
├── frontend/           # Next.js Web Application
│   ├── src/
│   │   ├── app/          # หน้าเว็บหลัก (Page & Layout)
│   │   ├── components/   # ส่วนประกอบต่างๆ (Upload, Preview, Result, Settings)
│   │   └── types/        # ตัวกำหนด Type ใน TypeScript
│   └── package.json
│
└── README.md           # คู่มือโปรเจกต์ (ไฟล์นี้)
```

---

## 🚀 วิธีการติดตั้งและรันใช้งาน (Getting Started)

### 1. เตรียมความพร้อมของระบบ
ตรวจสอบว่าเครื่องคอมพิวเตอร์ของคุณมี [Node.js](https://nodejs.org/) ติดตั้งอยู่ (แนะนำเวอร์ชัน 18 ขึ้นไป)

### 2. รันส่วนของ Backend (Server API)
1. เปิด Terminal หรือ Command Prompt แล้วเข้าไปที่โฟลเดอร์ `backend`:
   ```bash
   cd backend
   ```
2. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
3. เริ่มรัน Backend Server:
   ```bash
   npm start
   ```
   *เซิร์ฟเวอร์จะเริ่มต้นทำงานที่ `http://localhost:3000` โดยมี API Endpoint หลักที่ `POST http://localhost:3000/api/v1/ocr`*

---

### 3. รันส่วนของ Frontend (Client Web App)
1. เปิด Terminal ใหม่แล้วเข้าไปที่โฟลเดอร์ `frontend`:
   ```bash
   cd frontend
   ```
2. ติดตั้ง dependencies:
   ```bash
   npm install
   ```
3. เริ่มรัน Frontend Web App ในโหมด Development:
   ```bash
   npm run dev
   ```
   *หน้าเว็บจะทำงานที่ `http://localhost:3000` (หรือพอร์ตอื่น เช่น `http://localhost:3001` หากพอร์ต 3000 ถูกใช้งานโดย Backend)*

4. เปิดบราวเซอร์แล้วไปที่ที่อยู่ URL ที่แสดงขึ้นมา เพื่อเริ่มใช้งานระบบได้ทันที!
