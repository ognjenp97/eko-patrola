# Eko Patrola

A web application for reporting illegal waste dumps and tracking cleanup actions in local communities. Anyone can report a dump with photos and a location, and an admin reviews and manages submissions before they appear on the public map.

## Tech Stack

- **Frontend** — React (Vite) + Tailwind CSS + React Router
- **Backend** — Node.js + Express
- **Database** — MongoDB (Atlas)
- **Image storage** — Supabase Storage
- **Map** — Leaflet (satellite tiles via Esri)
- **Auth** — JWT (single admin account)

## Features

- Public report form: photos (up to 8), location picked on an interactive map, description
- Public landing page: live map of approved reports, recent reports grid
- Admin login and dashboard: approve/activate pending reports, mark as cleaned, delete reports (with image cleanup in storage)

## Project Structure

```
eko-patrola/
├── backend/    # Express API, MongoDB models and routes
└── frontend/   # React client
```

## Getting Started

1. Set up environment files:

   ```bash
   cp backend/.env.example backend/.env    # fill in your own MongoDB/Supabase/admin values
   cp frontend/.env.example frontend/.env
   ```

   To generate `ADMIN_PASSWORD_HASH`, run once:

   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
   ```

2. Install dependencies for the root, backend, and frontend in one go:

   ```bash
   npm run install:all
   ```

3. Start both servers at once (backend on :3000, frontend on :5173):

   ```bash
   npm run dev
   ```

   This runs `backend` and `frontend` concurrently, each logging with its own prefix.

   To run them separately instead, `cd backend` or `cd frontend` and use `npm run dev` as before.

## Status

Core flow (public submission → admin moderation → public map) is functional. Swapping the map provider to Google Maps, multi-city support, and further polish are planned next.
