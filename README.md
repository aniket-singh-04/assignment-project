# Store Rating Platform — Monorepo

A full-stack Web Application designed for managing stores, submitting user ratings and reviews, and tracking store analytics. Built as a monorepo containing both the backend API and frontend SPA.

---

## Monorepo Architecture

```
Roxiler/
├── backend/                # Node.js + Express + Prisma + PostgreSQL REST API
│   ├── src/                # Business logic, routes, controllers & repositories
│   ├── prisma/             # Schema definition & database migrations
│   ├── package.json        # Backend dependencies & npm scripts
│   └── README.md           # Backend documentation
│
├── frontend/               # React 19 + Vite + Tailwind CSS v4 SPA
│   ├── src/                # Role-based pages, components & API services
│   ├── package.json        # Frontend dependencies & npm scripts
│   └── README.md           # Frontend documentation
│
├── .gitignore              # Monorepo git ignore rules
└── README.md               # Monorepo overview & quickstart guide
```

---

## Tech Stack Overview

### Backend
- **Runtime & Framework**: Node.js (ES Modules), Express.js
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Authentication**: JWT, Cookie Parser, Argon2 / Bcrypt
- **Validation**: Zod
- **Testing & Tools**: Jest, Supertest, Nodemon, ESLint, Prettier

### Frontend
- **Framework & Build**: React 19, Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Forms & Validation**: React Hook Form, Zod
- **Icons & UI**: React Icons, Custom Glassmorphism UI
- **Linting**: Oxlint

---

## Quick Start Guide

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18+ recommended)
- **pnpm** (Package manager)
- **PostgreSQL** database server running locally or via Docker

---

### Step 1: Clone the Repository & Monorepo Setup

```bash
git clone <repository-url>
cd Roxiler
```

---

### Step 2: Configure & Start the Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy the environment variables template and configure your PostgreSQL URL:
   ```bash
   cp .env.example .env
   ```
4. Set up the database:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm seed
   ```
5. Start the backend development server:
   ```bash
   pnpm dev
   ```
   The API will start running on `http://localhost:5000`.

---

### Step 3: Configure & Start the Frontend

1. Open a new terminal tab and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the Vite development server:
   ```bash
   pnpm dev
   ```
   The web application will open at `http://localhost:5173`.

---

## User Roles & Key Features

| Role | Access & Capabilities |
|------|-----------------------|
| **System Admin** | Full management of system users and stores; view overall system statistics and metrics. |
| **Store Owner** | View dashboard metrics specifically for owned stores, see submitted customer ratings and detailed reviews. |
| **Normal User** | Search and filter stores, submit ratings (1 to 5 stars) and reviews, edit submitted reviews, manage user profile. |

---

## Sub-Project Documentation

For specific setup instructions, available scripts, and architecture details of individual sub-projects:
- 📖 [Backend Documentation](./backend/README.md)
- 📖 [Frontend Documentation](./frontend/README.md)
