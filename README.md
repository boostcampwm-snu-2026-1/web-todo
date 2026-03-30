# web-todo

Repository is split into two apps:

- `frontend/`: Vite client app
- `backend/`: Express API server

## Run locally

1. Install dependencies

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

2. Run backend and frontend in separate terminals

```bash
npm run dev:backend
npm run dev:frontend
```

Or run both from root on Linux:

```bash
npm run dev
```

## Backend API

- `GET /api/health`
- `GET /api/todo`
- `GET /api/todo/:id`
- `POST /api/todo`
- `PUT /api/todo/:id`
- `DELETE /api/todo/:id`

Frontend uses `/api` base URL and Vite proxy forwards it to `http://localhost:3000` in development.