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

## Table of Contents

- [Overview](#overview)
- [Why This Project Exists](#why-this-project-exists)
- [Problem Statement](#problem-statement)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [System Architecture](#system-architecture)
- [Technical Problems and Solutions](#technical-problems-and-solutions)
- [Workflow](#workflow)
- [API Design](#api-design)
- [API Response Examples](#api-response-examples)
- [Order Lifecycle](#order-lifecycle)
- [Data Model](#data-model)
- [Security Considerations](#security-considerations)
- [Scalability Path](#scalability-path)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)
- [Learning Goals](#learning-goals)
- [Project Status](#project-status)
- [License](#license)

---

## Overview

DocDrop is a secure temporary document submission and print-request management system.

Users can:

- upload a document
- choose print options
- receive an order ID and OTP
- track the request status

Admins can:

- manage incoming print requests
- update statuses as the request moves forward
- verify OTP during delivery or handoff
- ensure uploaded files are deleted after completion or expiry

This project is inspired by the real-world problem of secure temporary print handling, but it is designed as an original educational full-stack system.

---

## Why This Project Exists

Printing documents sounds simple until the workflow becomes digital.

A real print-request system has to answer practical questions such as:

- How does a user upload a document safely?
- Where is the file stored?
- How do we avoid permanent storage of private files?
- How do admins track order status?
- How do we verify delivery or handoff securely?
- How do we make sure expired or completed files are deleted?

DocDrop is built to solve these problems in a technically clean, modular, and scalable way.

---

## Problem Statement

Traditional file upload demos usually stop at **"file uploaded successfully."**

That is not enough for a realistic workflow.

In a proper document print-request platform, the system must handle:

1. Secure temporary file upload
2. Print option selection
3. Metadata tracking for each request
4. Status-based workflow management
5. OTP verification for secure handoff
6. Automatic cleanup of expired or completed files
7. Separation of user and admin responsibilities

DocDrop is designed to solve all of these in one integrated full-stack workflow.

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
- See full order details
- Update order statuses
- Verify OTP before delivery or handoff
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
- Tailwind CSS _(optional styling layer)_

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

````bash
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
│   ├── package.json
│   └── nodemon.json
│
├── .gitignore
└── README.md
System Architecture

The application is divided into three major layers:

1. Frontend Layer

The frontend is responsible for:

collecting file upload input

collecting print options

displaying order confirmation

showing order tracking information

providing an admin dashboard interface

The frontend does not handle business logic directly. Its responsibility is to collect user input, call the backend APIs, and render the returned data.

2. Backend API Layer

The backend exposes REST APIs for:

creating print orders

tracking orders

managing admin actions

verifying OTPs

deleting expired or completed files

The backend is responsible for:

request validation

business rules

file upload handling

status transition logic

OTP generation and verification

cleanup scheduling

communication with the database

3. Storage Layer

The storage system is split into two parts:

File Storage

Uploaded documents are stored temporarily in the backend uploads/ directory.

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

This separation is important because files and metadata serve different responsibilities.

Technical Problems and Solutions
Problem 1: Uploaded files can remain on the server forever

This is dangerous for privacy and wasteful for storage.

Solution

DocDrop stores uploaded files only temporarily. Every order includes expiry information, and a scheduled cleanup job regularly checks for expired or completed files and deletes them from storage.

Problem 2: File uploads can be unsafe

Users may upload unsupported file types, oversized files, or malicious content.

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

whether it has been printed

whether it has expired

whether it has already been deleted

Solution

Each upload generates a structured metadata record stored in MongoDB. This record tracks everything needed for the file lifecycle and print workflow.

Problem 4: Orders need controlled workflow states

Without clear status rules, an order can jump randomly from uploaded to delivered, creating inconsistent logic and messy UI behavior.

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

Each order gets an OTP when created. The OTP is later verified before marking the order as delivered or handed off. This provides a simple but practical security layer.

Problem 6: Frontend code becomes messy when API logic is mixed into components

If API calls, UI rendering, and state logic are all placed inside a single component, the frontend becomes difficult to maintain and scale.

Solution

The frontend separates concerns using:

pages for screens

reusable components for UI parts

services for API calls

hooks for fetching and state logic

utils for helper functions

This makes the frontend easier to organize, test, and debug.

Problem 7: Backend code becomes unmaintainable if everything lives in one file

A single Express file becomes chaotic very quickly.

Solution

The backend follows a layered architecture:

routes define endpoints

controllers handle request and response

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

Frontend sends multipart form data to the backend

Backend validates the file and request body

Backend stores the file temporarily

Backend creates order metadata in MongoDB

Backend generates an order ID and OTP

Frontend displays the success response to the user

Admin Workflow

Admin opens the dashboard

Dashboard fetches all active orders

Admin views full order details

Admin updates order status as work progresses

Admin verifies OTP before delivery or handoff

System deletes the file after completion or expiry

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

API Response Examples
Create Order Response
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "DOC-7F3A21",
    "otp": "4821",
    "status": "pending",
    "expiresAt": "2026-03-18T14:30:00.000Z"
  }
}
Track Order Response
{
  "success": true,
  "data": {
    "orderId": "DOC-7F3A21",
    "customerName": "Farhaan Khan",
    "copies": 2,
    "colorMode": "bw",
    "printSide": "single",
    "status": "printing",
    "createdAt": "2026-03-17T08:30:00.000Z",
    "expiresAt": "2026-03-18T14:30:00.000Z"
  }
}
OTP Verification Response
{
  "success": true,
  "message": "OTP verified successfully"
}
Error Response Example
{
  "success": false,
  "message": "Invalid file type. Only PDF files are allowed."
}
Order Lifecycle

A print request moves through defined status stages.

Example lifecycle
pending -> accepted -> printing -> printed -> out_for_delivery -> delivered -> deleted
Other possible endings
pending -> cancelled -> deleted
pending -> expired -> deleted
accepted -> expired -> deleted
printing -> expired -> deleted

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

Possible Future Security Upgrades

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

printer queue management

audit history

delivery assignment

role-based admin access

The goal is to build something small, but structured enough to grow without turning into spaghetti with Wi-Fi.

Local Development Setup
1. Clone the Repository
git clone https://github.com/Far-200/docdrop.git
cd docdrop
2. Setup the Backend
cd backend
npm install

Create a .env file inside the backend folder:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
MAX_FILE_SIZE=10485760
ORDER_EXPIRY_HOURS=6

Run the backend:

npm run dev
3. Setup the Frontend

Open a new terminal:

cd frontend
npm install

Create a .env file inside the frontend folder:

VITE_API_BASE_URL=http://localhost:5000/api

Run the frontend:

npm run dev
Environment Variables
Backend .env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
MAX_FILE_SIZE=10485760
ORDER_EXPIRY_HOURS=6
Frontend .env
VITE_API_BASE_URL=http://localhost:5000/api
Deployment
Frontend Deployment

The frontend can be deployed on:

Vercel

Netlify

Build command:

npm run build
Backend Deployment

The backend can be deployed on:

Render

Railway

Cyclic

VPS / cloud server

Recommended production requirements:

environment variables configured

MongoDB Atlas connection

persistent file storage or cloud object storage for production use

CORS configured for frontend domain

Production Notes

For production, local file storage is okay for learning but not ideal for scale.

A stronger production setup would use:

cloud storage for uploaded files

database-backed audit logging

admin authentication

HTTPS-only deployment

rate limiting and input sanitization

Future Improvements

admin authentication and authorization

user login system

payment flow integration

PDF preview

order history

email or SMS notifications

cloud storage migration

downloadable invoices

queue prioritization

analytics dashboard

Learning Goals

This project is intentionally designed to teach practical full-stack development through a realistic workflow.

Frontend

form handling

file upload with React

API integration

status-based UI rendering

reusable component design

Backend

Express routing

controller/service separation

file upload handling with Multer

MongoDB schema design

OTP generation and verification

cron-based cleanup jobs

structured workflow logic

Full Stack

connecting React with Express

designing a real-world workflow

handling temporary resources safely

thinking in systems, not just isolated pages

Project Status

Current status:

architecture planned

folder structure designed

implementation in progress

License

This project is created for learning and portfolio purposes.


Tiny note so your README doesn’t do a dramatic fainting spell on GitHub:
if you don’t yet have `frontend/public/preview.png`, either add that image or remove this part:

```md
<p align="center">
  <img src="./frontend/public/preview.png" alt="DocDrop Preview" width="100%" />
</p>
````
