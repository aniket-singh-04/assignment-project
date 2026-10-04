# Store Rating Platform — Backend

A production-oriented REST API built with **Node.js**, **Express.js**, **Prisma ORM**, and **PostgreSQL**.

---

## Tech Stack

| Layer       | Technology                   |
|-------------|------------------------------|
| Runtime     | Node.js (ES Modules)         |
| Framework   | Express.js                   |
| ORM         | Prisma                       |
| Database    | PostgreSQL                   |
| Auth        | JWT + Cookie Parser + Argon2 |
| Validation  | Zod                          |
| Testing     | Jest + Supertest             |

---

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma         # Prisma database schema & models
├── src/
│   ├── config/               # Environment & DB initialization
│   ├── controllers/          # Express route controllers (Auth, Store, Rating, Admin, Owner)
│   ├── db/                   # Database seed script
│   ├── middlewares/          # Custom middleware (Auth, Error handler, Validation, NotFound)
│   ├── repositories/         # Prisma database query abstraction layer
│   ├── routes/               # Express API endpoint definitions
│   ├── services/             # Application business logic
│   ├── validators/           # Zod schema validation rules
│   ├── app.js                # Express app setup & middleware pipeline
│   └── server.js             # HTTP server entry point & shutdown handlers
├── tests/                    # Integration & unit test suites
├── .env.example              # Environment variables template
├── eslint.config.js          # ESLint configuration
├── jest.config.js            # Jest testing configuration
├── package.json              # Backend dependencies & npm scripts
└── README.md
```

---

## Setup & Getting Started

### 1. Navigate to directory & install dependencies

```bash
cd backend
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and adjust your environment configuration:

```bash
cp .env.example .env
```

Ensure `DATABASE_URL` matches your PostgreSQL connection string:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/storerating?schema=public"
JWT_SECRET="your_jwt_secret_key"
NODE_ENV="development"
```

### 3. Database Migration & Seed

Generate Prisma client, apply database migrations, and seed initial data:

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm seed
```

### 4. Running the Server

- **Development Mode** (with hot reloading via Nodemon):
  ```bash
  pnpm dev
  ```
- **Production Mode**:
  ```bash
  pnpm start
  ```

### 5. Health Check Endpoint

```http
GET http://localhost:5000/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

## Available Scripts

| Script                | Description                                       |
|-----------------------|---------------------------------------------------|
| `pnpm dev`            | Start server in development mode (Nodemon)        |
| `pnpm start`          | Start server in production mode                   |
| `pnpm build`          | Generate Prisma client artifacts                  |
| `pnpm seed`           | Seed database with default data                   |
| `pnpm test`           | Execute test suite with Jest                      |
| `pnpm lint`           | Run ESLint checks                                 |
| `pnpm format`         | Format source code with Prettier                  |
| `pnpm prisma:generate`| Regenerate Prisma Client                          |
| `pnpm prisma:migrate` | Run development database migrations               |
| `pnpm prisma:deploy`  | Deploy migrations to production database          |

---

## API Capabilities

- **Auth System**: User Registration, Login, Logout, JWT-based Authentication.
- **Role-Based Access Control**:
  - **Admin**: Manage stores, system users, view system metrics & analytics.
  - **Owner**: View owned store details, store ratings, user reviews & statistics.
  - **User**: Search & filter stores, submit and edit ratings/reviews, update profile.
- **Validation**: Strict request payload validation powered by Zod.
