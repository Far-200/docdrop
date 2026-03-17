# DocDrop

DocDrop is a secure temporary document submission and print-request management system built for learning full-stack development through a realistic project workflow.

Users can upload a document, choose print options, receive an order ID and OTP, and track the request. Admins can manage incoming print requests, update statuses, verify OTPs at delivery or handoff, and ensure uploaded files are deleted after completion or expiry.

This project is inspired by the real-world problem of secure temporary print handling, but it is designed as an original educational full-stack system.

---

## Why this project exists

Printing documents sounds simple until the workflow becomes digital.

A real print-request system has to answer practical questions:

- How does a user upload a document safely?
- Where is the file stored?
- How do we avoid permanent storage of private files?
- How do admins track order status?
- How do we verify delivery or handoff securely?
- How do we make sure expired or completed files are deleted?

DocDrop is built to solve these problems in a technically clean and modular way.

---

## Problem Statement

Traditional file upload demos stop at "file uploaded successfully."

That is not enough for a real workflow.

In a document print-request platform, the system must handle:

1. Secure temporary file upload
2. Print option selection
3. Metadata tracking for each request
4. Status-based workflow management
5. OTP verification for secure handoff
6. Automatic cleanup of expired or completed files
7. Separation of user and admin responsibilities

DocDrop is designed to handle all of these as a single integrated workflow.

---

## Core Features

### User Features

- Upload a document for printing
- Choose print options such as:
  - number of copies
  - color or black & white
  - single-sided or double-sided
- Receive a unique order ID
- Receive an OTP for verification
- Track the status of an order

### Admin Features

- View all print requests
- Filter orders by status
- See order details
- Update order statuses
- Verify OTP before delivery/handoff
- Delete files after completion or expiry

### System Features

- Temporary file storage
- File type and size validation
- Metadata persistence in database
- Scheduled cleanup of expired files
- Modular backend architecture
- Clean separation of frontend and backend responsibilities

---

## Tech Stack

### Frontend

- React
- Vite
- Axios
- Tailwind CSS (optional styling layer)

### Backend

- Node.js
- Express.js
- Multer
- MongoDB
- Mongoose
- node-cron
- dotenv

---

## Folder Structure

```bash
docdrop/
├── frontend/
│   ├── public/
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
│   ├── package.json
│   └── vite.config.js
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

System Architecture

The application is divided into three main parts:

1. Frontend Layer

The frontend is responsible for:

collecting file upload input

collecting print options

displaying order confirmation

showing order tracking information

providing an admin dashboard interface

The frontend does not handle business logic directly. It only sends requests and renders responses.

2. Backend API Layer

The backend exposes REST APIs for:

creating print orders

tracking orders

managing admin actions

verifying OTPs

deleting expired or completed files

The backend is responsible for validation, business rules, file handling, and communication with the database.

3. Storage Layer

The storage system is split into two parts:

File Storage

Uploaded documents are stored temporarily in the backend uploads directory.

Metadata Storage

Order information is stored in MongoDB, including:

order ID

customer name

original file name

stored file path

print options

OTP

current status

timestamps

expiry information

This separation is important because files and metadata have different responsibilities.

Technical Problems and How We Solve Them
Problem 1: Uploaded files can remain on the server forever

This is dangerous for privacy and wasteful for storage.

Solution

DocDrop stores uploaded files only temporarily. Every order includes expiry information, and a scheduled cleanup job regularly checks for expired or completed files and deletes them from storage.

Problem 2: File uploads can be unsafe

Users may upload unsupported file types, huge files, or malicious content.

Solution

The backend uses Multer middleware with validation rules to:

restrict allowed file types

enforce maximum file size

sanitize file names

store files safely with generated names

Problem 3: A file alone is not enough to manage an order

A raw file in a folder cannot tell us:

who uploaded it

how many copies are needed

whether it is printed

whether it has expired

Solution

Each upload generates a structured metadata record stored in MongoDB. This record tracks everything needed for the file lifecycle and print workflow.

Problem 4: Orders need controlled workflow states

Without clear status rules, an order can jump randomly from uploaded to delivered, creating messy logic and inconsistent UI.

Solution

DocDrop uses a status-based lifecycle such as:

pending

accepted

printing

printed

out_for_delivery

delivered

expired

cancelled

deleted

The backend enforces valid status transitions so the workflow remains consistent.

Problem 5: Delivery or handoff needs verification

If documents are private, anyone should not be able to receive them.

Solution

Each order gets an OTP when created. The OTP is later verified before marking the order as delivered or handed off. This provides a simple and practical layer of security.

Problem 6: Frontend code becomes messy when API logic is mixed into components

If API calls, UI rendering, and state logic are all inside one component, the frontend becomes difficult to maintain.

Solution

The frontend separates concerns using:

pages for screens

reusable components for UI parts

services for API calls

hooks for data fetching logic

utils for helper functions

This makes the frontend easier to scale and debug.

Problem 7: Backend code becomes unmaintainable if everything lives in one file

A single Express file becomes chaotic very quickly.

Solution

The backend follows a layered architecture:

routes define endpoints

controllers handle request/response

services contain business logic

models define database structure

middleware handles validation and errors

jobs handle cleanup tasks

This keeps the project modular and production-style.

Workflow
User Workflow

User opens the upload page

User selects a document

User chooses print options

Frontend sends multipart form data to backend

Backend validates file and request body

Backend stores file temporarily

Backend creates order metadata in MongoDB

Backend generates order ID and OTP

Frontend displays success response to user

Admin Workflow

Admin opens dashboard

Dashboard fetches all active orders

Admin views order details

Admin updates status as work progresses

Admin verifies OTP before delivery/handoff

System deletes file after completion or expiry

API Design
Public/User Endpoints

POST /api/orders
Create a new print order

GET /api/orders/:orderId
Get safe order details for tracking

POST /api/orders/:orderId/verify
Verify OTP for order handoff

Admin Endpoints

GET /api/admin/orders
Get all orders

GET /api/admin/orders/:orderId
Get full order details

PATCH /api/admin/orders/:orderId/status
Update order status

DELETE /api/admin/orders/:orderId
Delete order and associated file

Utility Endpoints

GET /api/health
Server health check

Order Lifecycle

A print request moves through status stages.

Example lifecycle:

pending -> accepted -> printing -> printed -> out_for_delivery -> delivered -> deleted

Other possible endings:

pending -> cancelled -> deleted
pending/accepted/printing -> expired -> deleted

This lifecycle ensures that every order remains predictable and easy to track.

Data Model

A typical order record includes:

orderId

customerName

originalFileName

storedFileName

filePath

mimeType

fileSize

copies

colorMode

printSide

otp

status

createdAt

updatedAt

expiresAt

deletedAt

This schema supports tracking, cleanup, and future feature expansion.

Security Considerations

DocDrop is not a full production security platform yet, but it includes important safeguards:

restricted file types

file size limits

sanitized storage filenames

generated OTP for verification

temporary storage instead of permanent retention

structured status control

separated admin routes

Future improvements could include:

admin authentication

JWT-based protected routes

encryption for stored files

rate limiting

audit logs

malware scanning

Scalability Path

This project starts small, but the architecture allows future upgrades such as:

cloud file storage

user authentication

payment integration

notification system

printer queue logic

audit history

delivery assignment

role-based admin access

The goal is to build something small but structured enough to grow.

Local Development Setup
Clone the Repository
