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

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own MongoDB/Supabase/admin values
npm run dev
```

To generate `ADMIN_PASSWORD_HASH`, run once:

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Status

Core flow (public submission → admin moderation → public map) is functional. Swapping the map provider to Google Maps, multi-city support, and further polish are planned next.
