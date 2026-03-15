export default class TodoModel {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }

    _commit(todos) {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    addTodo(text) {
        const todo = { id: Date.now(), text, completed: false };
        this.todos.push(todo);
        this._commit(this.todos);
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this._commit(this.todos);
    }

    editTodo(id, newText) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, text: newText } : todo
        );
        this._commit(this.todos);
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this._commit(this.todos);
    }
}