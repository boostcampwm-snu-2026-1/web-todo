import { todoAPI } from './api.js';

export default class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.view.bindEvents({
            add: (text) => this.handleAdd(text),
            click: (id, action) => this.handleClick(id, action)
        });
        
        this.init()
    }

    async init() {
        const todos = await todoAPI.fetchTodos();
        this.model.setTodos(todos);
        this.view.render(this.model.todos);
    }

    async handleAdd(text) {
        const newTodo = await todoAPI.createTodo(text);
        this.model.addTodo(newTodo);
        this.view.render(this.model.todos);
    }

    async handleClick(id, action) {
        if (action === 'delete') {
            this.model.deleteTodo(id);
        } else if (action === 'toggle') {
            this.model.toggleTodo(id);
        } else if (action === 'edit') {
            this.handleEdit(id);
        }
        this.view.render(this.model.todos);
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