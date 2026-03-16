import type { Todo } from '../../domain/todo-interface';
import { customElement } from '../decorators/custom-element';

@customElement('todo-item')
export class TodoItem extends HTMLElement {
  setTodo(todo: Todo) {
    this.dataset.id = String(todo.id);
    this.render(todo);
  }

  private render(todo: Todo) {
    this.classList.toggle('done', todo.done);
    this.innerHTML = /* html */ `
      <li class="task-item ${todo.done ? 'done' : ''}">
        <div class="checkbox" aria-label="${todo.done ? 'Mark incomplete' : 'Mark complete'}">
          <svg><use href="/public/asset/icon_sprite.svg#icon-check" /></svg>
        </div>
        <span class="task-label">${todo.content}</span>
        <div class="task-actions">
          <button class="action-btn" data-action="edit" aria-label="Edit">
            <svg>
              <use href="/public/asset/icon_sprite.svg#icon-edit" />
            </svg>
          </button>
          <button class="action-btn" data-action="delete" aria-label="Delete">
            <svg>
              <use href="/public/asset/icon_sprite.svg#icon-trash" />
            </svg>
          </button>
        </div>
      </li>
    `;
  }

  connectedCallback() {
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }

  private handleClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const btn = target.closest<HTMLButtonElement>('.action-btn');

    if (btn === null) {
      this.dispatchEvent(
        new CustomEvent('todo:toggle', {
          bubbles: true,
          detail: { id: this.dataset.id },
        })
      );
      return;
    }

    const action = btn.dataset.action;
    if (action === undefined) return;

    this.dispatchEvent(
      new CustomEvent(`todo:${action}`, {
        bubbles: true,
        detail: { id: this.dataset.id },
      })
    );
  };
}
