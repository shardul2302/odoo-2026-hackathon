# EcoSphere ESG Management Platform

EcoSphere is a full-stack **ESG (Environmental, Social & Governance) Management Platform** built for the **Odoo Hackathon 2026**. It enables organizations to monitor sustainability initiatives, manage carbon emissions, CSR activities, compliance, and ESG reporting through a modern web application.

---

# Team

- **Shardul Mane** — Team Lead
- **Anshika Sharma** — Team Member

---

# System Architecture

> The complete system architecture and database design can be viewed here:

### 🔗 Database Design (Mermaid)

https://mermaid.ai/app/projects/ae941aa2-5134-4220-a3f9-0a886cb9d998/diagrams/849bb037-9903-4113-93da-4cee93845917/version/v0.1/edit?shouldShowPopup=true&entryPoint=Dashboard

---

# Project Structure

```
EcoSphere/
│
├── frontend/                 # React + Vite Frontend
├── backend/                  # Express + MongoDB Backend
├── demoImages/               # Application Screenshots
└── README.md
```

---

# Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- shadcn/ui
- Lucide React
- Sonner
- Recharts

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

---

# Features

## Authentication

- Secure JWT Authentication
- Login
- Registration
- Protected Routes
- Logout

## Master Data

- Departments
- Categories
- Emission Factors

## Environmental

- Carbon Transactions
- Automatic CO₂ Calculation

## Dashboard

- ESG Dashboard
- Statistics Cards
- Charts
- Quick Navigation

---

# Getting Started

## Clone Repository

```bash
git clone <repository-url>

cd EcoSphere
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Demo Credentials

## Admin

```
Email:
admin@ecosphere.com

Password:
Admin123!
```

---

## Manager

```
Email:
manager@ecosphere.com

Password:
Manager123!
```

---

## Employee

```
Email:
employee@ecosphere.com

Password:
Employee123!
```

---

# Seed Demo Data

Populate MongoDB with demo data.

```bash
cd backend

node src/seed/seed.js
```

---

# Demo Images

## Login Page

Secure authentication page for EcoSphere users.

![Login](demoImages/Screenshot%202026-07-12%20181007.png)

---

## Dashboard

Modern ESG dashboard showing key metrics and navigation.

![Dashboard](demoImages/Screenshot%202026-07-12%20181950.png)

---

## Departments Management

Manage organization departments.

![Departments](demoImages/Screenshot%202026-07-12%20182030.png)

---

## Categories Management

Manage ESG categories linked with departments.

![Categories](demoImages/Screenshot%202026-07-12%20182043.png)

---

## Emission Factors

Manage emission factors used in CO₂ calculations.

![Emission Factors](demoImages/Screenshot%202026-07-12%20182058.png)

---

## Carbon Transactions

Track employee and organizational carbon emissions.

![Carbon Transactions](demoImages/Screenshot%202026-07-12%20182111.png)

---

## MongoDB Collections

Database collections storing application data.

![MongoDB](demoImages/Screenshot%202026-07-12%20182453.png)

---

## Responsive Registration Page

Responsive account creation page for new users.

![Register](demoImages/Screenshot%202026-07-12%20182823.png)

---

# Backend Modules

```
Authentication
├── Register
├── Login
├── Logout
└── Current User

Master Data
├── Departments
├── Categories
└── Emission Factors

Environmental
└── Carbon Transactions
```

---

# Database Collections

```
organizations
users
departments
categories
emissionFactors
carbonTransactions
csrActivities
participations
challenges
policies
complianceIssues
badges
rewards
```

---

# API Base URL

```
http://localhost:5000/api/v1
```

---

# Built For

**Odoo Hackathon 2026**

EcoSphere demonstrates a scalable ESG Management Platform capable of managing organizational sustainability initiatives with a modern MERN stack architecture.

---

⭐ If you found this project helpful, consider giving it a star.
