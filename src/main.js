const API_URL = "https://69b93716e69653ffe6a6efc9.mockapi.io/todos";

function render(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    todos.forEach(todo => {
      const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.done) li.classList.add('completed');

        li.innerHTML = `
            <input type="checkbox" ${todo.done ? 'checked' : ''}>
            <span>${todo.content}</span>
            <button class="delete-btn">🗑️</button>
        `;

      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', (e) => {toggleTodo(todo.id, e.target.checked);});

      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {deleteTodo(todo.id);});

      todoList.appendChild(li);
    });
}

async function fetchTodos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("데이터를 가져오는 데에 실패함.");
    const result = await response.json();
    
    console.log("서버 데이터: ", result);
    render(result);
  } catch (error) {console.error("통신 에러 발생: ", error);}
}

async function addTodo(content) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content, 
        done: false,
      }),
    });

    if (!response.ok) throw new Error("데이터 저장에 실패함.");
    await fetchTodos();
  } catch (error) {
    console.error("추가 중 에러 발생: ", error);
  }
}

async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("데이터 삭제에 실패함.");

    await fetchTodos();
  } catch (error) {console.error("삭제 중 에러 발생:", error);}
}

async function toggleTodo(id, isDone) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        done: isDone,
      }),
    });

    if (!response.ok) throw new Error("상태 업데이트에 실패함.");
    
    await fetchTodos();
  } catch (error) {console.error("토글 중 에러 발생:", error);}
}

const addBtn = document.getElementById('add-btn');
const todoInput = document.getElementById('todo-input');

addBtn.addEventListener('click', () => {
  const content = todoInput.value.trim();
  if (content) {
    addTodo(content);
    todoInput.value = '';
  }
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

fetchTodos();