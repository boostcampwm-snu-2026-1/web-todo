import './style.css';
import { renderTodos, displayDate } from './render.js';

const mockData = [
    { id: 1, content: "모듈화", done: false },
    { id: 2, content: "Vite", done: true }
];

function init() {
    displayDate();
    renderTodos(mockData);
    console.log("complete");
}

init();