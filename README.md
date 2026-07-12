# EcoSphere ESG Management Platform

EcoSphere is a full-stack ESG management platform built for the Odoo Hackathon 2026. It includes a React + Vite frontend, an Express + MongoDB backend, and seeded demo data for departments, categories, emission factors, carbon transactions, and users.

## Project Structure

- frontend/ - React admin dashboard UI
- backend/ - Express API and MongoDB models/controllers
- backend/src/seed/seed.js - Demo data seeding script

## Tech Stack

- Frontend: React, Vite, Tailwind-style UI components, React Router
- Backend: Node.js, Express, MongoDB, Mongoose, JWT authentication
- Utilities: Axios, Sonner, Lucide icons, Recharts

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on http://localhost:5000.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:3002 (or the next available Vite port).

## Demo Credentials

Use these demo accounts to test the application:

- Admin: admin@ecosphere.com / Admin123!
- Employee: employee@ecosphere.com / Employee123!
- Manager: manager@ecosphere.com / Manager123!

## Seed Data

To populate the database with demo ESG records:

```bash
cd backend
node src/seed/seed.js
```

## Team

- Team Member: Shardul Mane (TL)
- Team Member: Anshika Sharma
