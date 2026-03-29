import type { Todo } from '../../domain/todo-interface';
import { ASSET_LINK } from '../assets/asset-link';
import { EVENT_NAMES } from '../assets/event-name';
import { COMPONENT_TAGS } from '../assets/tag-name';
import { customElement } from '../decorators/custom-element';

@customElement(COMPONENT_TAGS.TODO_EDIT)
export class TodoEdit extends HTMLElement {
  private originalItem: Element | null = null;

  setOriginalItem(item: Element) {
    this.originalItem = item;
  }

  getOriginalItem() {
    return this.originalItem;
  }

  setTodo(todo: Todo) {
    this.dataset.id = String(todo.id);
    this.render(todo);
  }

  private render(todo: Todo) {
    this.innerHTML = /* html */ `
    <li class="task-item task-item-editing">
      <input class="task-edit-input" type="text" value="${todo.content}">
      <div class="task-actions">
        <button class="action-btn action-btn-confirm" aria-label="Confirm">
          <svg><use href=${ASSET_LINK.CONFIRM_ICON} /></svg>
        </button>
        <button class="action-btn action-btn-cancel" aria-label="Cancel">
          <svg><use href=${ASSET_LINK.CANCEL_ICON} /></svg>
        </button>
      </div>
    </li>
  `;
    this.querySelector('input')?.focus();
  }

  connectedCallback() {
    this.addEventListener('keydown', this.handleKeydown);
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.handleKeydown);
    this.removeEventListener('click', this.handleClick);
  }

  private handleKeydown = (e: Event) => {
    if (!(e instanceof KeyboardEvent)) {
      return;
    }

    if (e.key === 'Enter') {
      this.handleCommit();
    }
    if (e.key === 'Escape') {
      this.handleCancel();
    }
  };

  private handleClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.closest('.action-btn-confirm')) {
      this.handleCommit();
      return;
    }

    if (target.closest('.action-btn-cancel')) {
      this.handleCancel();
    }
  };

  private handleCommit() {
    const input = this.querySelector<HTMLInputElement>('input');
    if (input === null) return;

    const newContent = input.value.trim();
    if (newContent.length === 0) return;

    this.dispatchEvent(
      new CustomEvent(EVENT_NAMES.TODO_UPDATE, {
        bubbles: true,
        detail: { id: this.dataset.id, newContent },
      })
    );
  }

  private handleCancel() {
    this.dispatchEvent(
      new CustomEvent(EVENT_NAMES.TODO_CANCEL, {
        bubbles: true,
        detail: { id: this.dataset.id },
      })
    );
  }
}
