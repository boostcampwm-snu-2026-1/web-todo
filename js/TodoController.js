import { todoAPI } from './api.js';

export default class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.init();

        this.view.bindEvents({
            add: (text) => this.handleAdd(text),
            click: (id, action) => this.handleClick(id, action)
        });
    }

    async init() {
        const todos = await todoAPI.fetchTodos();
        this.model.setTodos(todos);
        this.view.render(this.model.todos, false);
    }

    async handleAdd(text) {
        const nextId = this.model.todos.length > 0
            ? Math.max(...this.model.todos.map(t => Number(t.id))) + 1
            : 1;
        
        const newTodoData = {
            id: String(nextId),
            createdAt: new Date().toISOString(),
            content: text,
            completed: false
        }
        const responseTodo = await todoAPI.createTodo(newTodoData);
        this.model.addTodo(responseTodo);
        this.view.render(this.model.todos, true);
    }

    async handleClick(id, action) {
        if (action === 'delete') {
            this.model.deleteTodo(id);
        } else if (action === 'toggle') {
            this.model.toggleTodo(id);
        } else if (action === 'edit') {
            this.handleEdit(id);
        }
        this.view.render(this.model.todos, false);
    }

    async handleEdit(id) {
        const todo = this.model.todos.find(t => t.id === id);
        const newText = prompt('할 일을 수정하세요:', todo.content);
        
        if (newText !== null && newText.trim() !== '') {
            this.model.editTodo(id, newText.trim());
            this.view.render(this.model.todos);
        }
    }
}