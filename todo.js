const input = document.querySelector("#new-task");
const addButton = document.querySelector("#add-task");
const todoList = document.querySelector("#task-list");

// 데이터 저장소
const todos = [];

// todo 데이터 객체 생성
function createTodo(text) {
  return {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1, // 간단한 ID 생성
    text,
    done: false,
  };
}

// GET todos
function getTodos() {
  fetch("https://69b9372ee69653ffe6a6f09a.mockapi.io/todos")
    .then((res) => res.json())
    .then((result) => {
      todos.push(...result);
      for (const todo of todos) {
        const item = createTodoItem(todo);
        todoList.appendChild(item);
      }
    });
}

// todo 데이터를 DOM 으로 변환
function createTodoItem(todo) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const toggleButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  li.dataset.id = todo.id;

  toggleButton.textContent = "Done";
  toggleButton.classList.add("toggle-button");

  span.textContent = todo.content;
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");

  li.appendChild(span);
  li.appendChild(toggleButton);
  li.appendChild(deleteButton);
  return li;
}

// todo 추가
function addTodo(text) {
  const todo = createTodo(text);
  todos.push(todo);

  const item = createTodoItem(todo);
  todoList.appendChild(item);

  input.value = "";
}

// 초기 데이터 로드
getTodos();

// 이벤트 위임 - 추후 delete/toggle 여기서 처리
todoList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);

  // deleteTodo(id) 구현
  if (e.target.classList.contains("delete-button")) {
    todos.splice(
      todos.findIndex((t) => t.id === id),
      1,
    );
    li.remove();
  }

  // toggleTodo(id) 구현
  if (e.target.classList.contains("toggle-button")) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.done = !todo.done;
      li.classList.toggle("done", todo.done);

      e.target.textContent = todo.done ? "Undo" : "Done";
    }
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
