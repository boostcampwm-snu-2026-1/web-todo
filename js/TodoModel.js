export default class TodoModel {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }

    // 서버에서 가져온 전체 데이터를 모델에 저장
    setTodos(todos) {
        this.todos = todos;
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

    editTodo(id, newContent) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? { ...todo, content: newContent } : todo
        );
        this._commit(this.todos);
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this._commit(this.todos);
    }
}