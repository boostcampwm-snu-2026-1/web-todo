import type { TodoUsecase } from '../../domain/todo-interface';
import { EVENT_NAMES } from '../assets/event-name';
import { COMPONENT_TAGS } from '../assets/tag-name';
import { inject } from '../decorators/attr';
import { customElement } from '../decorators/custom-element';
import { errorDispatch } from '../decorators/event';
import { optimistic } from '../utils/optimistic-render';
import { TodoEdit } from './todo-edit';
import { TodoItem } from './todo-item';

const isTodoDetail = (value: unknown): value is { id: string } =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  typeof (value as Record<string, unknown>).id === 'string';

const isTodoUpdateDetail = (
  value: unknown
): value is { id: string; newContent: string } =>
  isTodoDetail(value) &&
  'newContent' in value &&
  typeof (value as Record<string, unknown>).newContent === 'string';

@customElement(COMPONENT_TAGS.TODO_LIST)
export class TodoList extends HTMLElement {
  @inject<TodoUsecase>('todoUsecase')
  accessor todoUsecase!: TodoUsecase;

  async render() {
    const result = await this.todoUsecase.listTodos();
    if (result.state === 'error') {
      this.dispatchEvent(
        new CustomEvent(EVENT_NAMES.TODO_ERROR, {
          bubbles: true,
          detail: { error: result.detailedError },
        })
      );
      return;
    }

    this.innerHTML = '<ul class="task-list"></ul>';
    const ul = this.querySelector('ul');
    if (ul === null) {
      return;
    }

    for (const todo of result.data) {
      const item = new TodoItem();
      ul.appendChild(item);
      item.setTodo(todo);
    }
  }

  connectedCallback() {
    this.addEventListener(EVENT_NAMES.TODO_ADDED, this.handleAdded);
    this.addEventListener(
      EVENT_NAMES.TODO_ADDED_ROLLBACK,
      this.handleAddRollback
    );
    this.addEventListener(EVENT_NAMES.TODO_TOGGLE, this.handleToggle);
    this.addEventListener(EVENT_NAMES.TODO_EDIT, this.handleEdit);
    this.addEventListener(EVENT_NAMES.TODO_DELETE, this.handleDelete);
    this.addEventListener(EVENT_NAMES.TODO_UPDATE, this.handleUpdate);
    this.addEventListener(EVENT_NAMES.TODO_CANCEL, this.handleCancel);
  }

  disconnectedCallback() {
    this.removeEventListener(EVENT_NAMES.TODO_ADDED, this.handleAdded);
    this.removeEventListener(
      EVENT_NAMES.TODO_ADDED_ROLLBACK,
      this.handleAddRollback
    );
    this.removeEventListener(EVENT_NAMES.TODO_TOGGLE, this.handleToggle);
    this.removeEventListener(EVENT_NAMES.TODO_EDIT, this.handleEdit);
    this.removeEventListener(EVENT_NAMES.TODO_DELETE, this.handleDelete);
    this.removeEventListener(EVENT_NAMES.TODO_UPDATE, this.handleUpdate);
    this.removeEventListener(EVENT_NAMES.TODO_CANCEL, this.handleCancel);
  }

  @errorDispatch(EVENT_NAMES.TODO_ERROR)
  private async handleAdded(e: Event) {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    const content = String(e.detail.content);

    const ul = this.querySelector('ul');
    if (ul === null) {
      return;
    }
    const tempItem = new TodoItem();
    tempItem.dataset.temp = 'true';
    ul.appendChild(tempItem);
    tempItem.setTodo({ id: -1, content, done: false });
    await this.render();
  }

  @errorDispatch(EVENT_NAMES.TODO_ERROR)
  private async handleAddRollback() {
    await this.render();
  }

  @errorDispatch(EVENT_NAMES.TODO_ERROR)
  private handleToggle(e: Event) {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    const id = String(e.detail.id);

    const item = this.querySelector<TodoItem>(`todo-item[data-id="${id}"]`);
    if (item === null) {
      return;
    }
    const optimisticFn = () => item.toggleDone();
    const asyncFn = () =>
      this.todoUsecase.toggleTodo({
        id: Number(e.detail.id),
      });
    const rollbackFn = () => this.render();
    return optimistic({ optimisticFn, asyncFn, rollbackFn });
  }

  @errorDispatch(EVENT_NAMES.TODO_ERROR)
  private handleEdit(e: Event) {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    if (!isTodoDetail(e.detail)) {
      return;
    }

    const { id } = e.detail;

    const item = this.querySelector(`todo-item[data-id="${id}"]`);
    if (item === null) {
      return;
    }

    const content = item.querySelector('.task-label')?.textContent ?? '';
    const done = item.classList.contains('done');

    const editEl = new TodoEdit();
    editEl.setOriginalItem(item);
    item.replaceWith(editEl);
    editEl.setTodo({ id: Number(id), content, done });
  }

  @errorDispatch(EVENT_NAMES.TODO_ERROR)
  private handleUpdate(e: Event) {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    if (!isTodoUpdateDetail(e.detail)) {
      return;
    }
    const { id, newContent } = e.detail;

    const editEl = this.querySelector(`todo-edit[data-id="${id}"]`);
    if (editEl === null) {
      return null;
    }

    const optimisticFn = () => {
      const isDone = editEl.classList.contains('done') ?? false;
      const tempItem = new TodoItem();
      editEl.replaceWith(tempItem);
      tempItem.setTodo({ id: Number(id), content: newContent, done: isDone });
    };
    const asyncFn = () =>
      this.todoUsecase.updateTodo({
        id: Number(id),
        newContent,
      });
    const rollbackFn = () => this.render();

    const result = optimistic({ optimisticFn, asyncFn, rollbackFn });
    return result;
  }

  private handleCancel = (e: Event) => {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    if (!isTodoDetail(e.detail)) {
      return;
    }
    const { id } = e.detail;

    const editEl = this.querySelector(`todo-edit[data-id="${id}"]`);
    if (editEl === null) {
      return;
    }

    const original = (editEl as TodoEdit).getOriginalItem();
    if (original === null) {
      return;
    }

    editEl.replaceWith(original);
  };

  @errorDispatch(EVENT_NAMES.TODO_ERROR)
  private handleDelete(e: Event) {
    if (!(e instanceof CustomEvent)) {
      return;
    }
    if (!isTodoDetail(e.detail)) {
      return;
    }

    const optimisticFn = () => {
      const id = e.detail.id;
      const item = this.querySelector(`todo-item[data-id="${id}"]`);
      if (item === null) {
        return;
      }
      item.remove();
    };
    const asyncFn = () =>
      this.todoUsecase.deleteTodo({
        id: Number(e.detail.id),
      });
    const rollbackFn = () => this.render();

    const result = optimistic({ optimisticFn, asyncFn, rollbackFn });
    return result;
  }
}
