window.todoActions = {
  addTodo(text) {
    window.todoState.todos.push({
      id: Date.now(),
      text,
      completed: false,
    });
  },

  deleteTodo(id) {
    window.todoState.todos = window.todoState.todos.filter(
      (todo) => todo.id !== id
    );
  },
};
