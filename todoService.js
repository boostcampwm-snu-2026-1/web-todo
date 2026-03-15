export let todos = [];

export function addTodo(text) {
    const newTodo = { id: Date.now(), text, completed: false };
    todos.push(newTodo);
    return todos;
}

export function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    return todos;
}

export function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    return todos;
}