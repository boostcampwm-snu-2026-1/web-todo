import { todoAPI } from './api.js';

const TODO_ACTIONS = {
    TOGGLE: 'toggle',
    DELETE: 'delete',
    EDIT: 'edit'
};

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
        try {
            const todos = await todoAPI.fetchTodos();
            this.model.setTodos(todos);
            this.view.render(this.model.todos, false);
        } catch (error) {
            console.error("초기 데이터 로드 실패:", error);
        }
    }

    async handleAdd(text) {
        try {
            // id와 createdAt은 서버(DB)에서 생성하도록 위임
            const newTodoData = {
                content: text,
                completed: false
            };
            
            const responseTodo = await todoAPI.createTodo(newTodoData);
            this.model.addTodo(responseTodo);
            this.view.render(this.model.todos, true);
        } catch (error) {
            console.error("추가 실패:", error);
            alert("할 일을 추가하지 못했습니다.");
        }
    }

    async handleClick(id, action) {
        // '==' 대신 '===' 사용하여 엄격한 비교 수행
        const todo = this.model.todos.find(t => String(t.id) === String(id));
        if (!todo) return;

        try {
            if (action === TODO_ACTIONS.DELETE) {
                // Optimistic Update (화면 먼저 갱신)
                this.model.deleteTodo(id);
                this.view.render(this.model.todos, false);
                await todoAPI.deleteTodo(id);

            } else if (action === TODO_ACTIONS.TOGGLE) {
                // Optimistic Update
                const updatedStatus = !todo.completed;
                this.model.toggleTodo(id);
                this.view.render(this.model.todos, false);
                
                await todoAPI.updateTodo(id, { completed: updatedStatus });

            } else if (action === TODO_ACTIONS.EDIT) {
                await this.handleEdit(id);
            }
        } catch (error) {
            console.error("작업 실패:", error);
            // 에러 발생 시 원복을 위해 데이터를 다시 불러옴
            this.init();
        }
    }

    async handleEdit(id) {
        // prompt는 임시 사용, 추후 커스텀 모달
        const todo = this.model.todos.find(t => String(t.id) === String(id));
        const newText = prompt('할 일을 수정하세요:', todo.content);
        
        if (newText !== null && newText.trim() !== '') {
            try {
                const newContent = newText.trim();
                
                // 모델 반영 및 렌더링
                this.model.editTodo(id, newContent);
                this.view.render(this.model.todos, false);
                
                // 서버 업데이트
                await todoAPI.updateTodo(id, { content: newContent });
            } catch (error) {
                console.error("수정 실패:", error);
                this.init(); // 에러 시 상태 동기화
            }
        }
    }
}