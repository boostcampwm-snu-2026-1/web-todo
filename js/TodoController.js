export default class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.view.bindEvents({
            add: (text) => this.handleAdd(text),
            click: (id, action) => this.handleClick(id, action)
        });
        
        this.view.render(this.model.todos);
    }

    handleAdd(text) {
        this.model.addTodo(text);
        this.view.render(this.model.todos);
    }

    handleClick(id, action) {
        if (action === 'delete') {
            this.model.deleteTodo(id);
        } else if (action === 'toggle') {
            this.model.toggleTodo(id);
        } else if (action === 'edit') {
            this.handleEdit(id);
        }
        this.view.render(this.model.todos);
    }

    handleEdit(id) {
        const todo = this.model.todos.find(t => t.id === id);
        const newText = prompt('할 일을 수정하세요:', todo.text);
        
        if (newText !== null && newText.trim() !== '') {
            this.model.editTodo(id, newText.trim());
        }
    }
}