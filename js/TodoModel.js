const STORAGE_TODO_KEY = 'todos';

export default class TodoModel {
    constructor() {
        this.todos = [];
    }

    // 서버에서 가져온 전체 할 일 목록을 세팅
    setTodos(todos) {
        this.todos = todos;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
            String(todo.id) === String(id) 
                ? { ...todo, completed: !todo.completed } 
                : todo
        );
    }

    editTodo(id, newContent) {
        this.todos = this.todos.map(todo => 
            String(todo.id) === String(id) 
                ? { ...todo, content: newContent } 
                : todo
        );
    }
    
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => String(todo.id) !== String(id));
    }

    
    //만약 나중에 오프라인 모드를 위해 남겨둠
    _saveToLocal() {
        // 현재는 서버 데이터와의 동기화 문제를 방지하기 위해 호출하지 않음
        // localStorage.setItem(STORAGE_TODO_KEY, JSON.stringify(this.todos));
    }
}