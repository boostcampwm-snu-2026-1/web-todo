export default class TodoView {
    constructor() {
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
    }

    get _todoText() { return this.input.value; }
    _resetInput() { this.input.value = ''; }

    render(todos) {
        this.todoList.innerHTML = todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="checkbox" data-action="toggle"></div>
                <span class="todo-text">${todo.text}</span>
                <div class="action-btns">
                    <button class="icon-btn edit" data-action="edit">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    <button class="icon-btn delete" data-action="delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </li>
        `).join('');
    }

    bindEvents(handlers) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this._todoText.trim()) {
                handlers.add(this._todoText);
                this._resetInput();
            }
        });

        this.todoList.addEventListener('click', (e) => {
            const target = e.target;
            const item = target.closest('.todo-item');
            if (!item) return;

            const id = Number(item.dataset.id);
            const action = target.dataset.action || target.parentElement.dataset.action;
            
            if (action) handlers.click(id, action);
        });
    }
}