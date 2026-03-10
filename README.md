# Web Todo

A simple todo application with an Express REST API backend and a vanilla JS frontend.

## Setup

```bash
npm install
```

## Usage

```bash
node server.js
```

Open http://localhost:3000 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| PATCH | `/api/todos/:id/toggle` | Toggle todo done status |
| DELETE | `/api/todos/:id` | Delete a todo |

## Project Structure

```
├── server.js          # Express API server
├── todos.json         # Data store (auto-generated)
└── public/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── main.js    # App entry point
        ├── api.js     # Fetch API calls
        ├── render.js  # DOM rendering
        └── events.js  # Event delegation
```
