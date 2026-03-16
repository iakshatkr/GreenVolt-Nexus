# GreenVolt Nexus API

Base URL: `/api`

## Auth

### `POST /auth/register`

Creates a new user or station owner account.

Request body:

```json
{
  "name": "Kabir Driver",
  "email": "user@example.com",
  "password": "StrongPass123",
  "city": "Jaipur",
  "phone": "+91 9999999999",
  "role": "user"
}
```

### `POST /auth/login`

Authenticates a user and returns `{ user, token }`.

### `GET /auth/me`

Returns the authenticated user profile.

Headers:

```text
Authorization: Bearer <jwt>
```

## Stations

### `GET /stations`

Lists approved charging stations for public discovery.

Query params:

- `city`
- `search`
- `lat`
- `lng`
- `radiusKm`
- `approvalStatus` for admins

### `GET /stations/:id`

Returns one station.

### `GET /stations/owner/list`

Returns stations owned by the authenticated station owner or admin.

### `POST /stations`

Creates a new station listing.

Allowed roles: `station_owner`, `admin`

### `PUT /stations/:id`

Updates a station listing. Non-admin updates reset approval to `pending`.

Allowed roles: `station_owner`, `admin`

## Bookings

### `POST /bookings`

Creates a booking and prevents overlapping reservations on the same station port.

Allowed roles: `user`, `admin`

Request body:

```json
{
  "stationId": "station_object_id",
  "portNumber": 2,
  "startTime": "2026-03-20T10:00:00.000Z",
  "endTime": "2026-03-20T11:30:00.000Z",
  "energyRequestedKwh": 20
}
```

### `GET /bookings/my`

Returns booking history for the logged-in user.

### `GET /bookings/owner`

Returns bookings for stations owned by the logged-in station owner.

Allowed roles: `station_owner`, `admin`

### `PATCH /bookings/:id/complete`

Marks a booking as completed.

Allowed roles: `station_owner`, `admin`

## Payments

### `POST /payments/checkout/:bookingId`

Runs a Stripe-style mock checkout, marks the booking as paid, and generates energy usage data.

Allowed roles: `user`, `admin`

### `GET /payments/history`

Returns payment history for the logged-in user.

Allowed roles: `user`, `admin`

## Analytics

### `GET /analytics/owner`

Returns owner-level metrics:

- number of stations
- bookings
- revenue
- successful payments
- energy by station

Allowed roles: `station_owner`, `admin`

### `GET /analytics/admin`

Returns platform-wide metrics:

- users
- stations
- pending stations
- bookings
- total revenue
- solar generated
- delivered energy
- carbon saved

Allowed roles: `admin`

## Admin

### `GET /admin/users`

Lists all users.

### `DELETE /admin/users/:id`

Deletes a user.

### `GET /admin/stations`

Lists all stations with owner references.

### `PATCH /admin/stations/:id/approval`

Approves or rejects a station listing.

Request body:

```json
{
  "approvalStatus": "approved"
}
```

## Error format

Errors return a consistent shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": {}
}
```

## Seeded demo data

Running `npm run seed` creates:

- 1 admin
- 1 station owner
- 1 end user
- 3 demo charging stations
- 2 demo bookings
- simulated payment and energy usage records
