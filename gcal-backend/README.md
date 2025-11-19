## Google Calendar Backend (Node.js / Express)

Secure intermediary backend handling Google OAuth 2.0, all Google API calls server‑side, and persisting a local copy of events in MongoDB.

### Features
- Full OAuth 2.0 flow (server-side) using `googleapis`
- Stores Google Refresh Token and Google User ID in MongoDB
- Event CRUD API writes to Google Calendar and MongoDB with compensation logic
- Session-based auth with secure cookies and Mongo-backed session store

### Tech
- Node.js, Express, Mongoose
- googleapis
- express-session + connect-mongo
- Joi validation, Helmet, CORS

### Setup
1) Create a Google Cloud project and OAuth 2.0 Client (Web Application):
   - Authorized redirect URI: `http://localhost:4000/auth/google/callback`
2) Copy `env.sample` to `.env` and fill values:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/gcal_backend
SESSION_SECRET=change_this_in_production
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback
GOOGLE_CALENDAR_ID=primary
CLIENT_ORIGIN=http://localhost:5173
```
3) Install and run:
```
npm install
npm run dev
```

### OAuth Endpoints
- `GET /auth/google` → Redirects to Google consent
- `GET /auth/google/callback` → Handles OAuth callback, stores refresh token and sets session
- `GET /auth/me` → Session check
- `POST /auth/logout` → Destroys session

### Event API (requires session)
- `GET /api/events` → All events for the authenticated Google user
- `POST /api/events` → Creates on Google Calendar then persists in MongoDB
- `PUT /api/events/:id` → Updates both Google and local record
- `DELETE /api/events/:id` → Deletes both Google and local record

### Event fields
- `googleEventId` (external key)
- `userId` (Google user id)
- `source` ("Google")
- `status` ("confirmed"|"tentative"|"cancelled")
- `customColor` (optional)
- `title`, `start`, `end`, `description`


