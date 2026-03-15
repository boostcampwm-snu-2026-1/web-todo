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

  updateTodo(id, nextText) {
    const todo = window.todoState.todos.find((todo) => todo.id === id);

    if (!todo) {
      return;
    }

    todo.text = nextText;
  },

  deleteTodo(id) {
    window.todoState.todos = window.todoState.todos.filter(
      (todo) => todo.id !== id
    );
  },

  reorderTodos(draggedId, targetId, position) {
    if (draggedId === targetId) {
      return;
    }

    const todos = window.todoState.todos;
    const draggedIndex = todos.findIndex((todo) => todo.id === draggedId);
    const targetIndex = todos.findIndex((todo) => todo.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    const [draggedTodo] = todos.splice(draggedIndex, 1);
    const nextTargetIndex = todos.findIndex((todo) => todo.id === targetId);

    if (nextTargetIndex === -1) {
      todos.push(draggedTodo);
      return;
    }

    const insertIndex = position === "after" ? nextTargetIndex + 1 : nextTargetIndex;
    todos.splice(insertIndex, 0, draggedTodo);
  },
};
