pdfkit
# Log Viewer Backend

REST API สำหรับระบบ Log Viewer พัฒนาด้วย Node.js + Express + MongoDB เพื่อรองรับการเข้าสู่ระบบ, เรียกดู Log แบบมีตัวกรอง, และ export รายงานเป็น PDF/Excel

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- PDFKit (export PDF)
- ExcelJS (export Excel)

## โครงสร้างโปรเจกต์
```text
.
├── server.js
├── app
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── package.json
└── README.md
```

## การติดตั้งและรัน
1) ติดตั้ง dependencies
```bash
npm install
```

2) ตั้งค่า environment variables ในไฟล์ `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/logviewer
JWT_SECRET=your-secret
```

3) รันโปรเจกต์
```bash
npm run dev
```
หรือ
```bash
npm start
```

เซิร์ฟเวอร์จะทำงานที่ `http://localhost:5000`

## Environment Variables ที่ใช้งาน
- `PORT` พอร์ตของ API server
- `MONGO_URI` URL สำหรับเชื่อมต่อ MongoDB
- `JWT_SECRET` secret สำหรับ sign/verify token
- `JWT_EXPIRES_IN` ระยะเวลา token (ค่าในโค้ดปัจจุบันใช้ `1d`)
- `NODE_ENV`, `TZ` ใช้เพื่อกำหนดสภาพแวดล้อม/โซนเวลา

## Authentication
ระบบใช้ Bearer Token ผ่าน header:
```http
Authorization: Bearer <token>
```

## API Endpoints

### User

#### `POST /user/login`
ใช้เข้าสู่ระบบเพื่อรับ JWT token

**Request body**
```json
{
  "username": "demo",
  "password": "123456"
}
```

**Response (success)**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "id": "...",
    "role": "admin",
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

#### `GET /user/dropdown` (Auth required)
ดึงรายการผู้ใช้สำหรับ dropdown

---

### Log

#### `GET /log` (Auth required)
ดึงรายการ log พร้อม pagination/filter/sort

**Query params ที่รองรับ**
- `page` (default: `1`)
- `limit` (default: `50`)
- `sortField` (`timestamp` | `timeMs` | `action`)
- `sortOrder` (`asc` | `desc` | `custom` | `none`)
- `action` (`all` หรือ action เดี่ยว/หลายค่า)
- `startDate`, `endDate` (รูปแบบวันที่ที่แปลงเป็น Date ได้)
- `userId` (`all` หรือ id เดี่ยว/หลายค่า)
- `statusCode`
- `labnumber` (ส่งเป็น comma-separated ได้)
- `minTimeMs`, `maxTimeMs`

> หมายเหตุ: หากไม่ส่ง `startDate/endDate` ระบบจะใช้ช่วงเวลาของ "วันนี้" อัตโนมัติ

#### `GET /log/export` (Auth required)
export log ตามเงื่อนไข filter เดียวกับ `/log`

**Query เพิ่มเติม**
- `format=pdf` เพื่อดาวน์โหลด PDF
- `format=excel` เพื่อดาวน์โหลด Excel
- หากไม่ส่ง `format` จะตอบกลับเป็น JSON

## Role & Permission (ตามโค้ดปัจจุบัน)
- ผู้ใช้ `admin` เห็นข้อมูลได้ทั้งหมด
- ผู้ใช้ `user` เห็นเฉพาะข้อมูลของตัวเอง (`userId`)

## ตัวอย่างเรียกใช้งานด้วย cURL

Login:
```bash
curl -X POST http://localhost:5000/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"123456"}'
```

Get logs:
```bash
curl "http://localhost:5000/log?page=1&limit=20&sortField=timestamp&sortOrder=desc" \
  -H "Authorization: Bearer <token>"
```

Export excel:
```bash
curl "http://localhost:5000/log/export?format=excel&startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer <token>" \
  -o report.xlsx
```

## หมายเหตุสำหรับการพัฒนา
- โปรเจกต์นี้มี `node_modules/` อยู่ใน repo แล้ว แต่ในการใช้งานจริงแนะนำให้ติดตั้งผ่าน `npm install` ตามปกติ
- ควรแยกไฟล์ `.env.example` สำหรับใช้งานร่วมทีม และไม่ commit ค่าจริงของ `JWT_SECRET`