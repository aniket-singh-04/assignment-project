# Store Rating Platform — Frontend

A responsive Single Page Application (SPA) built with **React 19**, **Vite**, **Tailwind CSS v4**, and **React Router v7**.

---

## Tech Stack

| Layer          | Technology                    |
|----------------|-------------------------------|
| Library        | React 19                      |
| Build Tool     | Vite                          |
| Styling        | Tailwind CSS v4               |
| Routing        | React Router v7               |
| Form Management| React Hook Form + Zod Resolvers|
| Icons          | React Icons                   |
| Linter         | Oxlint                        |

---

## Project Structure

```
frontend/
├── public/                 # Static assets (favicons, SVG icons)
├── src/
│   ├── assets/             # Brand logos & media assets
│   ├── components/         # Reusable UI components (Modals, Navbar, Sidebar, DataTable, etc.)
│   ├── context/            # Global React Contexts (AuthContext, ThemeContext)
│   ├── pages/              # Views organized by role:
│   │   ├── admin/          # Admin Dashboard, User & Store Management
│   │   ├── auth/           # Login & Registration views
│   │   ├── owner/          # Store Owner Dashboard & Analytics
│   │   ├── shared/         # Profile management
│   │   └── user/           # User Store browsing & rating interfaces
│   ├── routes/             # App Router configuration & Protected / Role-based Routes
│   ├── services/           # Axios / Fetch API integrations for Backend REST endpoints
│   ├── validation/         # Zod schemas for client-side form validation
│   ├── App.jsx             # Root App component wrapper
│   ├── index.css           # Global Tailwind CSS styles
│   └── main.jsx            # React application entry point
├── netlify.toml            # Netlify deployment configuration
├── vite.config.js          # Vite build configuration
├── package.json            # Dependencies & frontend build scripts
└── README.md
```

---

## Setup & Getting Started

### 1. Navigate to directory & install dependencies

```bash
cd frontend
pnpm install
```

### 2. Running in Development Mode

```bash
pnpm dev
```

The application will start locally at `http://localhost:5173`.

### 3. Production Build

To bundle the application for production deployment:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

---

## Available Scripts

| Script         | Description                                     |
|----------------|-------------------------------------------------|
| `pnpm dev`     | Start Vite local development server with HMR    |
| `pnpm build`   | Build optimized bundle for production           |
| `pnpm preview` | Preview production build locally                |
| `pnpm lint`    | Run Oxlint check across the frontend codebase   |

---

## Key Features

- **Role-Based Views**: Tailored interfaces for `Admin`, `Store Owner`, and standard `User`.
- **Interactive Dashboards**: Data tables, search filters, pagination, and store metrics.
- **Ratings & Reviews**: Dynamic rating components and review modals for users.
- **Glassmorphism UI**: Modern aesthetic designed with Tailwind CSS v4 styling.
