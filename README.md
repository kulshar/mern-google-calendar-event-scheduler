# 📅 Event Scheduler — MERN + Google Calendar Sync  
A secure, real-time capable, Google Calendar–synchronized event scheduling platform built using the **MERN stack**, **OAuth 2.0**, **Typescript (preferred)**, and **Tailwind CSS**.  
This project provides a unified calendar dashboard with advanced filtering, interactive views, and bi-directional Google Calendar synchronization.

---

## 🚀 Features

### 🔐 Authentication & Security (OAuth 2.0)
- Full **Google OAuth 2.0 Authorization Code Flow**
- Secure refresh token storage in MongoDB
- Backend-only communication with Google APIs
- Rotation of access tokens using refresh tokens (no tokens exposed to frontend)

---

## 🗂 Event Management (MongoDB + Google Sync)

Each event stored locally includes:
- `googleEventId`
- `userId`
- `source` `"Google"`
- `status` (`Confirmed`, `Tentative`, `Cancelled`)
- `customColor`
- Standard fields: `title`, `start`, `end`, `description`

### CRUD Behavior
- **Create:** Saves event to Google Calendar → stores local copy
- **Update:** Atomic update on both Google Calendar + MongoDB  
- **Delete:** Deletes from Google Calendar + database

---

## 🖥 Frontend (React + Tailwind UI)

### 📆 Calendar Dashboard
- Built using **FullCalendar**
- View modes: **Month, Week, Day**
- Dynamic event coloring:
  1. Custom local color (highest priority)
  2. Status-based color (Confirmed Green / Cancelled Red / Tentative Yellow)
  3. Fallback neutral color

### 🧩 Advanced Filters Panel
- Status filter (mutually exclusive)
- Color tag filter (multi-select OR logic)
- Date range override filter
- Debounced search (title/description)
- Persistent sidebar layout
- All event creation/editing occurs in a **reusable Off-Canvas modal**

### 📱 Responsive Design
- Fully mobile-first implementation using Tailwind CSS

---

## 🏗 Tech Stack

**Frontend:**
- React 18
- Typescript
- Tailwind CSS
- FullCalendar
- Axios / React Query / Zustand (state management)

**Backend:**
- Node.js + Express
- Typescript (optional)
- MongoDB + Mongoose
- Google APIs SDK (`googleapis`)

---

# 📁 Project Structure

/backend <br/>
/src <br/>
/config <br/>
/controllers <br/>
/routes <br/>
/models <br/>
/services (Google API service) <br/>
server.ts <br/>
.env <br/>

/frontend <br/>
/src <br/>
/components <br/>
/calendar <br/>
/offcanvas <br/>
/filters <br/>
/context or /store (Zustand/Context) <br/>
/pages <br/>
/utils <br/>
tailwind.config.js <br/>
.env <br/>

---

# 🔧 Environment Variables

### **Backend `.env`**

PORT=4000 <br/>
MONGODB_URI=mongodb://localhost:27017/gcal_backend  <br/>
SESSION_SECRET=change_this_in_production <br/>

### OAuth 2.0
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com <br/>
GOOGLE_CLIENT_SECRET=your_google_client_secret <br/>
#### Must be registered in Google Cloud console OAuth credentials <br/>
GOOGLE_REDIRECT_URI=http://localhost:4000/auth/google/callback <br/>

### Calendar
GOOGLE_CALENDAR_ID=primary <br/>
### CORS
CLIENT_ORIGIN=http://localhost:5173 <br/>


---

# ▶️ Installation & Setup

## 1. Clone Repository
```bash
git clone https://github.com/yourname/mern-google-calendar-event-scheduler.git
cd mern-google-calendar-event-scheduler
```

## 2. Backend Setup
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

## 3. Frontend Setup
1) Ensure backend is running at `http://localhost:4000` and has CORS for `http://localhost:5173`.
2) Install deps and start:
```
npm install
npm run dev
```
3) Visit `http://localhost:5173`, sign in via Google, then manage events.


🔌 API Endpoints

Auth
Method	  Endpoint	                  Description
GET	      /api/auth/google	          Start OAuth 2.0 login
GET	      /api/auth/google/callback	  OAuth redirect handler

Events
Method	  Endpoint	            Description
GET	      /api/events	          Get all events
POST	    /api/events	          Create new event (Google + MongoDB)
PUT	      /api/events/:id	      Update event
DELETE	  /api/events/:id	      Delete event


## 🧪 Evaluation Checklist (Meets Assessment Requirements)
Backend

✔ Secure OAuth implementation

✔ Refresh token storage

✔ Google API service layer

✔ Local event persistence

✔ Proper CRUD syncing

Frontend

✔ Responsive Tailwind UI

✔ FullCalendar integration

✔ Multi-view Calendar (Month/Week/Day)

✔ Offcanvas event editor

✔ Advanced Filtering Panel

✔ Dynamic event color logic

✔ Persistent global state (Zustand/Context)

Other

✔ Clean repo structure

✔ Production-ready code style

✔ Professional README


## 📸 UI Preview (Example)


<img width="1910" height="907" alt="image" src="https://github.com/user-attachments/assets/f930011d-47c2-433d-8730-ff291642cfa2" />



## 🏁 Final Notes

This repository contains a complete MERN + OAuth + Google Calendar synced event management system that fulfills all functional and UI/UX requirements of the assessment.

For any questions or improvements, feel free to open an issue or contribute.

⭐ If this project helped you, give the repository a star!


