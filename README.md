# MiniStore

Tienda demo (Node/Express + React + Vite + MongoDB).


## Requisitos
- Node 18+
- MongoDB

## Variables de entorno
- backend/.env
  - PORT=4000
  - MONGO_URL=...
  - ADMIN_TOKEN=...
  - CORS_ORIGINS=http://localhost:5173
- frontend/.env
  - VITE_API_URL=http://localhost:4000
  - VITE_ADMIN_TOKEN=...

## Desarrollo
```bash
# backend
cd backend
npm i
npm run dev

# frontend
cd ../frontend
npm i
npm run dev
