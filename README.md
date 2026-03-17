# DocDrop

<p align="center">
  <img src="./frontend/public/preview.png" alt="DocDrop Preview" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Framework-Express-black?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/File_Upload-Multer-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Scheduler-node--cron-purple?style=for-the-badge" />
</p>

<p align="center">
A secure temporary document submission and print-request management system built to learn full-stack development through a realistic workflow-driven project.
</p>

---

# Table of Contents

- Overview
- Why This Project Exists
- Problem Statement
- Core Features
- Tech Stack
- Folder Structure
- System Architecture
- Technical Problems and Solutions
- Workflow
- API Design
- API Response Examples
- Order Lifecycle
- Data Model
- Security Considerations
- Scalability Path
- Local Development Setup
- Environment Variables
- Deployment
- Future Improvements
- Learning Goals
- Project Status
- License

---

# Overview

DocDrop is a secure temporary document submission and print-request management system.

Users can:

- Upload a document
- Choose print options
- Receive an order ID and OTP
- Track the request status

Admins can:

- Manage incoming print requests
- Update statuses as the request moves forward
- Verify OTP during delivery or handoff
- Ensure uploaded files are deleted after completion or expiry

---

# Why This Project Exists

Printing documents sounds simple until the workflow becomes digital.

A real print-request system must answer:

- How does a user upload a document safely?
- Where is the file stored?
- How do we avoid permanent storage of private files?
- How do admins track order status?
- How do we verify delivery securely?
- How do we automatically delete expired documents?

DocDrop solves these problems through a structured full-stack architecture.

---

# Problem Statement

Most file upload demos stop at:

> “File uploaded successfully.”

But a real workflow requires much more.

A document print platform must support:

1. Secure temporary file upload
2. Print option selection
3. Metadata tracking
4. Order lifecycle management
5. OTP verification
6. Automatic cleanup of expired files
7. Admin workflow control

DocDrop solves these problems in one integrated system.

---

# Core Features

## User Features

- Upload documents for printing
- Select print options
  - Number of copies
  - Color / Black & White
  - Single or double-sided
- Receive unique Order ID
- Receive OTP for verification
- Track order status

## Admin Features

- View all print requests
- Filter orders by status
- View order details
- Update order status
- Verify OTP before delivery
- Delete expired or completed files

## System Features

- Temporary file storage
- File type and size validation
- Metadata persistence in MongoDB
- Scheduled cleanup jobs
- Modular backend architecture
- Clean frontend/backend separation

---

# Tech Stack

## Frontend

- React
- Vite
- Axios
- Tailwind CSS _(optional)_

## Backend

- Node.js
- Express.js
- Multer
- MongoDB
- Mongoose
- node-cron
- dotenv

---

# Folder Structure

```bash
docdrop/
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── preview.png
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── layouts/
│   │   ├── router/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── jobs/
│   │   ├── uploads/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── .gitignore
└── README.md
```

# DocDrop — System Documentation

graph TD
%% Define Styles
classDef layerFill fill:#f9f9f9,stroke:#333,stroke-width:2px;
classDef storageFill fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;
classDef processFill fill:#e8f5e9,stroke:#2e7d32,stroke-width:1px,stroke-dasharray: 5 5;

    %% Main Layers
    subgraph Frontend_Layer ["Frontend Layer (UI)"]
        direction TB
        UploadUI[Upload UI]:::processFill
        PrintOptions[Print Options Selection]:::processFill
        OrderTracking[Order Tracking]:::processFill
        AdminDashboard[Admin Dashboard]:::processFill
    end
    class Frontend_Layer layerFill;

    subgraph Backend_Layer ["Backend API Layer (Express)"]
        direction TB
        OrderMgmt[Order Lifecycle Management]:::processFill
        OTPLicense[OTP Generation]:::processFill
        FileValidation[File Validation (Multer)]:::processFill
        CleanupJob[Cleanup Scheduling (Cron)]:::processFill
    end
    class Backend_Layer layerFill;

    subgraph Storage_Layer ["Storage Layer"]
        direction TB
        FileStorage[(File Storage<br/>'backend/src/uploads/')]:::storageFill
        MetadataDB[(Metadata Storage<br/>'MongoDB')]:::storageFill
    end
    class Storage_Layer layerFill;

    %% Interactions
    Frontend_Layer -->|REST API Requests| Backend_Layer
    Backend_Layer -->|Temporarily Stores Files| FileStorage
    Backend_Layer -->|Reads/Writes Order Data| MetadataDB

    %% External Note
    CleanupJob -.->|Periodically Deletes Expired Files| FileStorages

## ## System Architecture

The system follows a decoupled **three-layer architecture** to ensure scalability and separation of concerns.

### 1. Frontend Layer

- **Role:** User Interface & Interaction.
- **Key Features:** Upload UI, Print options selection, Order confirmation/tracking, and Admin dashboard.
- **Note:** The frontend is "thin" and does not contain business logic.

### 2. Backend API Layer

- **Role:** The "Brain" of the application.
- **Responsibilities:** Order creation, OTP generation, lifecycle management, file validation, storage, cleanup scheduling, and DB communication.

### 3. Storage Layer

- **File Storage:** Documents are stored temporarily at `backend/src/uploads/`.
- **Metadata Storage (MongoDB):** Stores `orderId`, `customerName`, `filePath`, print options, `OTP`, `status`, and timestamps.

---

## ## Technical Problems and Solutions

| Problem                                 | Solution                                                              |
| :-------------------------------------- | :-------------------------------------------------------------------- |
| **Files remain on server forever**      | Scheduled cleanup jobs automatically delete expired files.            |
| **Unsafe file uploads**                 | Multer middleware enforces file types, size limits, and sanitization. |
| **Files alone cannot represent orders** | Structured metadata is linked and stored in MongoDB.                  |
| **Order workflow chaos**                | Implementation of controlled lifecycle states (Pending → Delivered).  |
| **Secure delivery verification**        | OTP generation during order creation for verification at delivery.    |

---

## ## Workflow

### User Workflow

1. Upload document & select print options.
2. File is stored temporarily; metadata is sent to backend.
3. Order ID + OTP generated.
4. User tracks order status via the UI.

### Admin Workflow

1. View dashboard & manage active orders.
2. Update order status (e.g., _Printing_ → _Printed_).
3. Verify OTP upon physical delivery.
4. System automatically deletes file after completion.

---

## ## API Design

### Public Endpoints

- `POST /api/orders` — Create a new order.
- `GET /api/orders/:orderId` — Fetch order details.
- `POST /api/orders/:orderId/verify` — Verify OTP.

### Admin Endpoints

- `GET /api/admin/orders` — List all orders.
- `GET /api/admin/orders/:orderId` — Single order view.
- `PATCH /api/admin/orders/:orderId/status` — Update lifecycle state.
- `DELETE /api/admin/orders/:orderId` — Manual deletion.

### Utility

- `GET /api/health` — System health check.

---

## ## API Response Examples

**Create Order (Success)**

```json
{
  "success": true,
  "data": {
    "orderId": "DOC-7F3A21",
    "otp": "4821",
    "status": "pending"
  }
}
```

## Error Example

'''json
{
"success": false,
"message": "Invalid file type"
}

## Order Lifecycle States

The system moves through a strictly defined state machine:

Happy Path: pending → accepted → printing → printed → delivered → deleted

Alternative 1: pending → cancelled → deleted

Alternative 2: pending → expired → deleted

## Security Considerations

Current Safeguards
File type/size restrictions.

OTP verification for delivery.

Temporary storage (Auto-cleanup).

Future Improvements
Admin authentication (JWT).

API Rate limiting.

Malware scanning for uploads.

## Local Development Setup

Clone Repository
git clone [https://github.com/Far-200/docdrop.git](https://github.com/Far-200/docdrop.git)
cd docdrop

## Backend Setup

cd backend
npm install
npm run dev

## Frontend Setup

cd frontend
npm install
npm run dev

## Environment Variables

Backend (.env)

Code snippet
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
MAX_FILE_SIZE=10485760
ORDER_EXPIRY_HOURS=6
Frontend (.env)

Code snippet
VITE_API_BASE_URL=http://localhost:5000/api

## Learning Goals

Frontend: File upload handling, API integration, Reusable components.

Backend: Express architecture, MongoDB schemas, Cron jobs for cleanup.

Full Stack: System design and temporary resource management.

## License

This project is created for learning and portfolio purposes.
