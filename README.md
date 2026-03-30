# Web Todo

A full-stack todo app — vanilla JS frontend (Vite) backed by a local Express + MongoDB Atlas API.

## Project Structure

```
web-todo/
├── front/          # Vite vanilla JS frontend
│   ├── index.html
│   └── src/
│       ├── main.js       # App entry point
│       ├── api.js        # Fetch calls to local Express backend
│       ├── render.js     # DOM rendering
│       ├── events.js     # Event delegation
│       └── style.css
└── back/           # Express + Mongoose API server
    ├── index.js          # Server entry point
    ├── .env              # Local secrets (git-ignored)
    └── .env.example      # Template for required env vars
```

## Setup

### 1. Backend

```bash
cd back
npm install
```

Copy `.env.example` to `.env` and fill in your MongoDB Atlas credentials:

```bash
cp .env.example .env
```

```
URI="mongodb+srv://<username>:<password>@cluster0.xxxxxxx.mongodb.net/todo-db?appName=Cluster0"
```

Start the dev server (auto-restarts on file changes via nodemon):

```bash
npm run dev
```

### 2. Frontend

```bash
cd front
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

> The backend must be running at `http://localhost:3000` before opening the frontend.

## API

Base URL: `http://localhost:3000`

| Method | Endpoint      | Description             |
|--------|---------------|-------------------------|
| GET    | `/todos`      | Get all todos           |
| POST   | `/todos`      | Create a new todo       |
| PUT    | `/todos/:id`  | Update done status      |
| DELETE | `/todos/:id`  | Delete a todo           |

### Todo Object

```json
{
  "id": "6800e1cd61be84f2980ac73d",
  "content": "할 일 내용",
  "done": false,
  "createdAt": 1774004344
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `URI` | MongoDB Atlas connection string |
