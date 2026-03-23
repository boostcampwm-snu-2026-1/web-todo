import type { TodoUsecase } from '../../domain/todo-interface';
import { ASSET_LINK } from '../assets/asset-link';
import { EVENT_NAMES } from '../assets/event-name';
import { COMPONENT_TAGS } from '../assets/tag-name';
import { inject, queryStrict } from '../decorators/attr';
import { customElement } from '../decorators/custom-element';
import { dispatch, errorDispatch } from '../decorators/event';

@customElement(COMPONENT_TAGS.TODO_INPUT)
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
    if (!(e instanceof KeyboardEvent)) {
      return;
    }
    if (e.key === 'Enter') {
      this.handleAdd();
    }
  };

  @dispatch(EVENT_NAMES.TODO_ADDED)
  @errorDispatch(EVENT_NAMES.TODO_ERROR)
  private async handleAdd() {
    const content = this.inputEl.value.trim();
    if (content.length === 0) {
      return {
        state: 'error',
        detailedError: 'EMPTY_CONTENT',
      };
    }

    this.inputEl.value = '';
    this.inputEl.focus();
    this.dispatchEvent(
      new CustomEvent(EVENT_NAMES.TODO_ADDED, {
        bubbles: true,
        detail: { content },
      })
    );

    const response = await this.todoUsecase.addTodo({ content });

    if (response.state === 'error') {
      this.dispatchEvent(
        new CustomEvent(EVENT_NAMES.TODO_ADDED_ROLLBACK, { bubbles: true })
      );
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
