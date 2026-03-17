# Integration Report

## Current wiring

GreenVolt Nexus now exposes the full frontend -> backend -> MongoDB connection in both code and UI.

1. Frontend
   - React pages use the shared Axios client in `frontend/src/api/client.ts`.
   - The client reads `VITE_API_BASE_URL` and defaults to `http://localhost:5000/api`.
   - The landing page calls `GET /system/status` through that shared client.

2. Backend
   - Express mounts all application routes under `/api` in `backend/src/app.ts`.
   - A new public endpoint, `GET /api/system/status`, returns integration metadata.
   - The endpoint is routed through `backend/src/routes/systemRoutes.ts`, controller, and service layers.

3. MongoDB
   - `backend/src/config/database.ts` connects Mongoose before the API starts serving traffic.
   - When `MONGODB_URI` is missing or still set to the example Atlas placeholder, development mode falls back to `mongodb-memory-server` so local work can continue.
   - The status endpoint reads live Mongo-backed collection counts from `User`, `ChargingStation`, `Booking`, and `Payment` models.

## How the connection works at runtime

1. Browser loads the Vite frontend.
2. The landing page requests `GET /api/system/status`.
3. Express receives the request and runs the system controller/service.
4. The service reads the current Mongoose connection state.
5. The service queries MongoDB collection counts.
6. JSON response returns to the frontend.
7. The landing page renders API status, DB mode/state, allowed frontend origin, and collection totals.

## Files involved

- `frontend/src/api/client.ts`
- `frontend/src/pages/LandingPage.tsx`
- `frontend/src/types/index.ts`
- `backend/src/app.ts`
- `backend/src/config/database.ts`
- `backend/src/config/env.ts`
- `backend/src/routes/systemRoutes.ts`
- `backend/src/controllers/systemController.ts`
- `backend/src/services/systemService.ts`

## Notes

- In production, set a real `MONGODB_URI`; the in-memory fallback is only for non-production environments.
- The root `/health` route now also includes database connection metadata.
- Demo data can still be created with `npm run seed`.
