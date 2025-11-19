## React + Tailwind Calendar SPA

Responsive, mobile-first SPA using FullCalendar with advanced filtering and offcanvas-based event management. Connects to the companion Node.js backend.

### Run
1) Ensure backend is running at `http://localhost:4000` and has CORS for `http://localhost:5173`.
2) Install deps and start:
```
npm install
npm run dev
```
3) Visit `http://localhost:5173`, sign in via Google, then manage events.

### Features
- Calendar: Month/Week/Day views (FullCalendar)
- Offcanvas: Create/Edit/Delete events with validation
- Filters: status (exclusive), color tags (multi), date range override, debounced search
- Dynamic colors: customColor > status color > neutral


