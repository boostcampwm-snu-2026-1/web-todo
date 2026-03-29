const input = document.querySelector("#new-task");
const addButton = document.querySelector("#add-task");
const todoList = document.querySelector("#task-list");

const API_URL = import.meta.env.VITE_API_URL;

// GET todos
function getTodos() {
  fetch(`${API_URL}/todos`)
    .then((res) => res.json())
    .then((result) => {
      for (const todo of result) {
        const item = createTodoItem(todo);
        todoList.appendChild(item);
      }
    });
}

// POST todo
function postTodo(todo) {
  fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((res) => res.json())
    .then((result) => {
      const item = createTodoItem(result);
      todoList.appendChild(item);
    });
}

// DELETE todo
function deleteTodo(id) {
  fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
  }).then(() => {
    const li = todoList.querySelector(`li[data-id="${id}"]`);
    if (li) li.remove();
  });
}

// UPDATE todo content
function updateTodoContent(id, content) {
  fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}

// TOGGLE todo
function toggleTodo(id, done) {
  fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ done }),
  }).then(() => {
    const li = todoList.querySelector(`li[data-id="${id}"]`);
    if (li) {
      li.classList.toggle("done", done);
      const toggleButton = li.querySelector(".toggle-button");
      if (toggleButton) toggleButton.textContent = done ? "Undo" : "Done";
    }
  });
}

// todo 데이터를 DOM 으로 변환
function createTodoItem(todo) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const toggleButton = document.createElement("button");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  li.dataset.id = todo.id;

  if (todo.done) li.classList.add("done");

  toggleButton.textContent = todo.done ? "Undo" : "Done";
  toggleButton.classList.add("toggle-button");

  span.textContent = todo.content;

  editButton.textContent = "Edit";
  editButton.classList.add("edit-button");

  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");

  li.appendChild(span);
  li.appendChild(toggleButton);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  return li;
}

// todo 추가
function addTodo(text) {
  postTodo({ content: text, done: false });
  input.value = "";
}

// 초기 데이터 로드
getTodos();

// 이벤트 위임 - 추후 delete/toggle 여기서 처리
todoList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  // deleteTodo(id) 구현
  if (e.target.classList.contains("delete-button")) {
    deleteTodo(id);
  }

  // toggleTodo(id) 구현
  if (e.target.classList.contains("toggle-button")) {
    const isDone = li.classList.toggle("done");
    toggleTodo(id, isDone);
  }

  // editTodo(id) 구현
  if (e.target.classList.contains("edit-button")) {
    const span = li.querySelector("span");
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    input.classList.add("edit-input");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");

    li.replaceChild(input, span);
    e.target.replaceWith(saveButton);
    input.focus();

    const save = () => {
      const newContent = input.value.trim();
      if (newContent) {
        span.textContent = newContent;
        updateTodoContent(id, newContent);
      }
      li.replaceChild(span, input);
      saveButton.replaceWith(editButton);
    };

    saveButton.addEventListener("click", save);
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") save();
      if (ev.key === "Escape") {
        li.replaceChild(span, input);
        saveButton.replaceWith(editButton);
      }
    });
  }
});

// 버튼 클릭으로 추가
addButton.addEventListener("click", () => {
  const task = input.value.trim();
  if (task) addTodo(task);
});

// Enter 키로 추가
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const task = input.value.trim();
    if (task) addTodo(task);
  }
});
