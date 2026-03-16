# GreenVolt Nexus

GreenVolt Nexus is a production-style full-stack MERN platform for managing solar-powered EV charging stations. It includes a TypeScript React frontend, a TypeScript Express backend, MongoDB models, JWT authentication, role-based dashboards, booking protection, simulated payments, and energy analytics.

The original static prototype files at the repository root were left intact. The full application now lives in `frontend/` and `backend/`.

## Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, React Router, Zustand, Axios, Recharts, Mapbox
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcryptjs, Zod
- Deployment targets: Vercel for the frontend, Render or Railway for the backend, MongoDB Atlas for the database

## Monorepo layout

```text
frontend/
  src/
    api/               Axios client
    components/        Layout, map, and reusable UI blocks
    hooks/             App bootstrap hooks
    pages/             Landing + role-specific dashboards
    router/            Route tree and protected route setup
    store/             Zustand auth store
    types/             Frontend API/domain types
backend/
  src/
    config/            Env parsing and DB connection
    constants/         Roles and status enums
    controllers/       HTTP handlers
    data/              Demo seed data
    middleware/        Auth, validation, logging, and errors
    models/            Mongoose schemas
    routes/            REST endpoints
    scripts/           Database seed runner
    services/          Business logic
    types/             Express/JWT typing
    utils/             Async helpers, token helpers, API errors
docs/
  API.md               REST API reference
```

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
copy backend\\.env.example backend\\.env
copy frontend\\.env.example frontend\\.env
```

3. Update environment values:

- `backend/.env`
  - `MONGODB_URI` should point to MongoDB Atlas or your local MongoDB
  - `JWT_SECRET` should be a long random string
  - `CLIENT_URL` should match the frontend URL
- `frontend/.env`
  - `VITE_API_BASE_URL` should point to the backend `/api`
  - `VITE_MAPBOX_TOKEN` should contain a public Mapbox token if you want the live map

4. Seed the demo data:

```bash
npm run seed
```

5. Start both apps in development:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Demo credentials

- Admin: `admin@greenvoltnexus.com` / `Admin@123`
- Station owner: `owner@greenvoltnexus.com` / `Owner@123`
- User: `user@greenvoltnexus.com` / `User@123`

## Available scripts

- `npm run dev` starts frontend and backend together
- `npm run build` builds both apps
- `npm run seed` seeds the backend demo data
- `npm run build --workspace backend` builds the API only
- `npm run build --workspace frontend` builds the client only

## Core feature map

- User dashboard
  - Search approved stations
  - View stations on a map
  - Create bookings
  - View booking history
  - Simulate payments and invoices
- Station owner dashboard
  - Create stations
  - Review owned stations
  - Inspect booking analytics
  - Track solar energy metrics
- Admin dashboard
  - View all users
  - Moderate station listings
  - Remove users
  - Review platform-wide metrics

## How data flows

### Frontend to backend

1. React pages call the shared Axios client in `frontend/src/api/client.ts`.
2. The client automatically attaches the JWT from local storage.
3. Requests hit Express routes in `backend/src/routes`.
4. Routes run through validation, auth middleware, then controllers.
5. Controllers delegate all business logic to services.
6. Services read/write MongoDB through Mongoose models.
7. JSON responses return to the frontend and update page state.

### Authentication flow

1. Registration or login sends credentials to `/api/auth/register` or `/api/auth/login`.
2. The backend hashes passwords with `bcryptjs` and signs a JWT with `jsonwebtoken`.
3. The frontend stores the token in local storage and Zustand.
4. On app load, `useBootstrapAuth` calls `/api/auth/me` to restore the user session.
5. Protected routes and backend middleware both enforce role-based access.

### Booking flow

1. A user selects a station and submits a booking window.
2. `bookingService.create` validates the station, checks the port number, and rejects overlapping time ranges.
3. The booking is stored with status and invoice metadata.
4. The user then triggers a payment simulation.
5. `paymentService.checkout` marks the payment as succeeded, updates booking payment status, and records `EnergyUsage`.

## Database relationships

- `User`
  - One user can own many `ChargingStation` documents
  - One user can create many `Booking` documents
  - One user can have many `Payment` records
- `ChargingStation`
  - Belongs to one station owner
  - Has many `Booking` documents
  - Has many `Payment` records
  - Has many `EnergyUsage` sessions
- `Booking`
  - Belongs to one user and one station
  - Can produce one payment record
  - Can produce one energy usage record
- `Payment`
  - Belongs to one booking, one user, and one station
- `EnergyUsage`
  - Belongs to one booking and one station
  - Stores solar vs grid energy breakdown for analytics

## Deployment notes

### Frontend on Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Env vars:
  - `VITE_API_BASE_URL`
  - `VITE_MAPBOX_TOKEN`

### Backend on Render or Railway

- Root directory: `backend`
- Build command: `npm run build`
- Start command: `npm run start`
- Env vars:
  - `NODE_ENV`
  - `PORT`
  - `CLIENT_URL`
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `STRIPE_PUBLIC_KEY`
  - `STRIPE_SECRET_KEY`

## Verification

- Backend TypeScript build completed successfully.
- Frontend TypeScript + Vite production build completed successfully.
- Seed script is included, but it was not run here because it requires a live MongoDB connection in `backend/.env`.

## API reference

See [`docs/API.md`](./docs/API.md) for the endpoint list and request/response guidance.
