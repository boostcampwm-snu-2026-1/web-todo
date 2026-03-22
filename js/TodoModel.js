export default class TodoModel {
    constructor() {
        this.todos = [];
    }

    setTodos(todos) {
        this.todos = todos;
    }

    addTodo(todo) {
        this.todos.push(todo);
        this._saveToLocal();
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
            todo.id == id ? { ...todo, completed: !todo.completed } : todo
        );
        this._saveToLocal();
    }

    editTodo(id, newContent) {
        this.todos = this.todos.map(todo => 
            todo.id == id ? { ...todo, content: newContent } : todo
        );
        this._saveToLocal();
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id != id);
        this._saveToLocal();
    }

    _saveToLocal() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}