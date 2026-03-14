window.todoActions = {
  addTodo(text) {
    window.todoState.todos.push({
      id: Date.now(),
      text,
      completed: false,
    });
  },

  toggleTodo(id) {
    const todo = window.todoState.todos.find((todo) => todo.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  },

  deleteTodo(id) {
    window.todoState.todos = window.todoState.todos.filter(
      (todo) => todo.id !== id
    );
  },
};
