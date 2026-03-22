export default class TodoView {
    constructor() {
        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');

        this.dateElement = document.getElementById('current-date')
        this._displayCurrentDate();
    }

    _displayCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const formattedDate = now.toLocaleDateString('en-US', options);
        
        if (this.dateElement) {
            this.dateElement.textContent = formattedDate;
        }
    }

    get _todoText() { return this.input.value; }
    _resetInput() { this.input.value = ''; }

    render(todos, isAdding=false) {
        this.todoList.innerHTML = todos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="checkbox" data-action="toggle"></div>
                <span class="todo-text">${todo.content}</span>
                <div class="action-btns">
                    <button class="icon-btn edit" data-action="edit">
                        <svg width="18" height="18"><use href="#icon-edit"/></svg>
                    </button>
                    <button class="icon-btn delete" data-action="delete">
                        <svg width="18" height="18"><use href="#icon-delete"/></svg>
                    </button>
                </div>
            </li>
        `).join('');

        if (isAdding) {
            setTimeout(() => {
                this.todoList.scrollTo({
                    top: this.todoList.scrollHeight,
                    behavior: 'smooth'
                });
            }, 0);
        } else {
            this.todoList.scrollTop = 0;
        }
    }

    bindEvents(handlers) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (e.isComposing) return;
            if (this._todoText.trim()) {
                handlers.add(this._todoText);
                this._resetInput();
                this.input.focus();
            }
        });

        this.todoList.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('[data-action]');
        if (!actionBtn) return;

        const item = actionBtn.closest('.todo-item');
        const id = Number(item.dataset.id);
        const action = actionBtn.dataset.action;
        
        handlers.click(id, action);
    });
    }
}