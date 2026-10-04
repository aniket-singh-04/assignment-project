# Store Rating Platform — Backend

A production-oriented REST API built with **Node.js**, **Express.js**, **Prisma**, and **PostgreSQL**.

---

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js (ES Modules)    |
| Framework   | Express.js              |
| ORM         | Prisma                  |
| Database    | PostgreSQL              |
| Auth        | JWT + Argon2 *(phase 2)*|
| Validation  | Zod *(phase 2)*         |

---

## Project Structure

```
store-rating-platform-backend/
│
├── src/
│   ├── config/           # Environment / DB config helpers
│   ├── controllers/      # Route handler functions
│   ├── middlewares/      # Express middleware (error, auth, etc.)
│   ├── routes/           # Express routers
│   ├── services/         # Business logic
│   ├── repositories/     # Database access layer (Prisma)
│   ├── validators/       # Zod schemas
│   ├── utils/            # Shared helper utilities
│   ├── app.js            # Express app setup
│   └── server.js         # HTTP server + graceful shutdown
│
├── prisma/
│   └── schema.prisma     # Database schema (phase 2)
│
├── .env.example
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── package.json
└── README.md
```

---

## Getting Started

### 1. Clone & install

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Run in development

```bash
pnpm dev
```

### 4. Health check

```
GET http://localhost:5000/health
```

```json
{ "success": true, "message": "Server is healthy" }
```

---

## Scripts

| Command                | Description                        |
|------------------------|------------------------------------|
| `pnpm dev`             | Start with nodemon (hot reload)    |
| `pnpm start`           | Start for production               |
| `pnpm lint`            | Run ESLint                         |
| `pnpm format`          | Format with Prettier               |
| `pnpm prisma:generate` | Generate Prisma client             |
| `pnpm prisma:migrate`  | Run database migrations            |

---

## Dependencies

| Package          | Purpose                                           |
|------------------|---------------------------------------------------|
| `express`        | Web framework                                     |
| `cors`           | Cross-Origin Resource Sharing headers             |
| `helmet`         | Security HTTP headers                             |
| `dotenv`         | Load `.env` variables                             |
| `morgan`         | HTTP request logging                              |
| `jsonwebtoken`   | JWT creation & verification *(phase 2)*           |
| `argon2`         | Password hashing *(phase 2)*                      |
| `zod`            | Schema validation *(phase 2)*                     |
| `@prisma/client` | Generated Prisma database client                  |
| `prisma`         | Prisma CLI — migrations & schema management       |
| `nodemon`        | Auto-restart server on file change (dev only)     |
| `eslint`         | JavaScript linter                                 |
| `prettier`       | Code formatter                                    |
