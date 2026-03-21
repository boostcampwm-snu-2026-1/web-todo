/**
 * @param {Array} todoList
 * @param {HTMLElement} container
 */ // JSDOC

export function render(todoList, container) {
    container.innerHTML = '';

    if (todoList.length === 0) {
        container.innerHTML = '<li class="empty-msg"></li>';
        return;
    }

    todoList.forEach((todo) => {
        const li = document.createElement("li");
        li.setAttribute('data-id', todo.id); // serial number for server communication

        li.innerHTML = `
            <div class="todo-left-side">
                <img src="${todo.completed ? 'image/cancel.png' : 'image/check.png'}" 
                     class="check-icon" data-action="toggle" />
                <div class="todo-text" style="text-decoration: ${todo.completed ? 'line-through' : ''}">
                    ${todo.item}
                </div>
            </div>
            <div class="todo-controls">
                <img class="edit" data-action="edit" src="image/pencil.png" />
                <img class="delete" data-action="delete" src="image/delete.png" />
            </div>`;
        
        container.appendChild(li);
    });
}

export function displayTodayDate() {
    const dateElement = document.querySelector(".date");
    const today = new Date();
    const options = {year: 'numeric', weekday: 'long', month: 'long', day: 'numeric' };
    dateElement.innerText = today.toLocaleDateString('en', options);
}