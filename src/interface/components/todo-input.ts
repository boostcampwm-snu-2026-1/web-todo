import type { TodoUsecase } from '../../domain/todo-interface';
import { ASSET_LINK } from '../assets/asset-link';
import { inject, queryStrict } from '../decorators/attr';
import { customElement } from '../decorators/custom-element';
import { dispatch, errorDispatch } from '../decorators/event';

@customElement('todo-input')
export class TodoInput extends HTMLElement {
  @inject<TodoUsecase>('todoUsecase')
  accessor todoUsecase!: TodoUsecase;
  @queryStrict<HTMLInputElement>('input')
  accessor inputEl!: HTMLInputElement;
  @queryStrict<HTMLButtonElement>('button')
  accessor buttonEl!: HTMLButtonElement;

  connectedCallback() {
    this.innerHTML = this.template();
    this.buttonEl.addEventListener('click', this.handleClickAdd);
    this.inputEl.addEventListener('keydown', this.handleKeydownAdd);
  }

  disconnectedCallback() {
    this.buttonEl.removeEventListener('click', this.handleClickAdd);
    this.inputEl.removeEventListener('keydown', this.handleKeydownAdd);
  }

  private handleClickAdd = () => {
    this.handleAdd();
  };

  private handleKeydownAdd = (e: Event) => {
    if (!(e instanceof KeyboardEvent)) return;
    if (e.key === 'Enter') this.handleAdd();
  };

  @dispatch('todo:added')
  @errorDispatch('todo:error')
  private async handleAdd() {
    const content = this.inputEl.value.trim();
    if (content.length === 0) {
      return {
        state: 'error',
        detailedError: 'EMPTY_CONTENT',
      } as const;
    }

    const response = await this.todoUsecase.addTodo({ content });

    if (response.state === 'success') {
      this.inputEl.value = '';
      this.inputEl.focus();
    }

    return response;
  }

  private template() {
    return /* html */ `
      <div class="input-row">
        <input class="task-input" type="text" placeholder="Add a new task...">
        <button class="add-btn" aria-label="Add task">
          <svg><use href=${ASSET_LINK.ADD_ICON} /></svg>
        </button>
      </div>
    `;
  }
}
