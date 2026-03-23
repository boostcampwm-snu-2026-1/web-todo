import type { Todo } from '../../domain/todo-interface';
import { ASSET_LINK } from '../assets/asset-link';
import { EVENT_NAMES } from '../assets/event-name';
import { COMPONENT_TAGS } from '../assets/tag-name';
import { customElement } from '../decorators/custom-element';

const ACTIONS = {
  EDIT: 'edit',
  DELETE: 'delete',
} as const;

type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

const ACTION_EVENT_MAP: Record<Action, string> = {
  [ACTIONS.EDIT]: EVENT_NAMES.TODO_EDIT,
  [ACTIONS.DELETE]: EVENT_NAMES.TODO_DELETE,
} as const;

const isAction = (value: unknown): value is Action =>
  typeof value === 'string' && value in ACTION_EVENT_MAP;

@customElement(COMPONENT_TAGS.TODO_ITEM)
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
          <svg><use href=${ASSET_LINK.CHECK_ICON} /></svg>
        </div>
        <span class="task-label">${todo.content}</span>
        <div class="task-actions">
          <button class="action-btn" data-action="${ACTIONS.EDIT}" aria-label="Edit">
            <svg>
              <use href=${ASSET_LINK.EDIT_ICON} />
            </svg>
          </button>
          <button class="action-btn" data-action="${ACTIONS.DELETE}" aria-label="Delete">
            <svg>
              <use href=${ASSET_LINK.DELETE_ICON} />
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
    if (!(target instanceof Element)) {
      return;
    }

    const btn = target.closest<HTMLButtonElement>('.action-btn');

    if (btn === null) {
      this.dispatchEvent(
        new CustomEvent(EVENT_NAMES.TODO_TOGGLE, {
          bubbles: true,
          detail: { id: this.dataset.id },
        })
      );
      return;
    }

    const action = btn.dataset.action;
    if (!isAction(action)) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent(ACTION_EVENT_MAP[action], {
        bubbles: true,
        detail: { id: this.dataset.id },
      })
    );
  };

  toggleDone() {
    const li = this.querySelector('li');
    if (li === null) return;

    const isDone = li.classList.contains('done');
    const checkbox = this.querySelector('.checkbox');

    li.classList.toggle('done', !isDone);
    this.classList.toggle('done', !isDone);
    if (checkbox !== null) {
      checkbox.setAttribute(
        'aria-label',
        isDone ? 'Mark complete' : 'Mark incomplete'
      );
    }
  }
}
