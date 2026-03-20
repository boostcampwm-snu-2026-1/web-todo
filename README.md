# Web Todo

A simple todo application using a vanilla JS frontend (Vite) with mockAPI.io as the backend.

## Setup

```bash
npm install
```

## Usage

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## API

Data is stored and served by [mockAPI.io](https://mockapi.io).  
Base URL: `https://69bd26262bc2a25b22ad7ca8.mockapi.io/todos`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | Get all todos |
| POST | `/todos` | Create a new todo |
| PUT | `/todos/:id` | Update a todo (toggle done) |
| DELETE | `/todos/:id` | Delete a todo |

### Todo Object

```json
{
  "id": "1",
  "content": "할 일 내용",
  "done": false,
  "createdAt": 1774004344
}
```

## Project Structure

```
├── index.html
├── src/
│   ├── main.js      # App entry point
│   ├── api.js       # Fetch API calls (mockAPI.io)
│   ├── render.js    # DOM rendering
│   ├── events.js    # Event delegation
│   └── style.css
└── package.json     # vite devDependency
```
