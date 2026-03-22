import { todoAPI } from './api.js';

export default class TodoController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        this.init();

        this.view.bindEvents({
            add: (text) => this.handleAdd(text),
            click: (id, action) => this.handleClick(id, action)
        });
    }

    async init() {
        const todos = await todoAPI.fetchTodos();
        this.model.setTodos(todos);
        this.view.render(this.model.todos, false);
    }

    async handleAdd(text) {
        const nextId = this.model.todos.length > 0
            ? Math.max(...this.model.todos.map(t => Number(t.id))) + 1
            : 1;
        
        const newTodoData = {
            id: String(nextId),
            createdAt: new Date().toISOString(),
            content: text,
            completed: false
        }
        const responseTodo = await todoAPI.createTodo(newTodoData);
        this.model.addTodo(responseTodo);
        this.view.render(this.model.todos, true);
    }

    async handleClick(id, action) {
        if (action === 'delete') {
            // 서버에서 삭제
            await todoAPI.deleteTodo(id); 
            //  모델(로컬 배열)에서 삭제
            this.model.deleteTodo(id);
        } else if (action === 'toggle') {
            const todo = this.model.todos.find(t => t.id == id);
            const updatedTodo = { ...todo, completed: !todo.completed };
                
            // 서버에 업데이트 요청
            await todoAPI.updateTodo(id, updatedTodo);
            // 모델 업데이트
            this.model.toggleTodo(id);
        } else if (action === 'edit') {
            await this.handleEdit(id);
        }
            // 변경된 상태로 다시 그리기
            this.view.render(this.model.todos, false);
    }

    async handleEdit(id) {
        const todo = this.model.todos.find(t => t.id == id);
        const newText = prompt('할 일을 수정하세요:', todo.content);
        
        if (newText !== null && newText.trim() !== '') {
            try {
                const updatedData = { ...todo, content: newText.trim() };
                
                // 서버에 수정된 내용 보냄
                await todoAPI.updateTodo(id, updatedData);
                // 모델 업데이트
                this.model.editTodo(id, newText.trim());
                
                this.view.render(this.model.todos, false);
            } catch (error) {
                console.error("수정 실패:", error);
            }
        }
    }
}