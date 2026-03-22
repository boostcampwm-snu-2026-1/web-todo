import type { TodoUsecase } from '../../domain/todo-interface';
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

@customElement('todo-list')
export class TodoList extends HTMLElement {
  @inject<TodoUsecase>('todoUsecase')
  accessor todoUsecase!: TodoUsecase;

  async render() {
    const result = await this.todoUsecase.listTodos();
    if (result.state === 'error') {
      this.dispatchEvent(
        new CustomEvent('todo:error', {
          bubbles: true,
          detail: { error: result.detailedError },
        })
      );
      return;
    }

    this.innerHTML = '<ul class="task-list"></ul>';
    const ul = this.querySelector('ul');
    if (ul === null) return;

    for (const todo of result.data) {
      const item = new TodoItem();
      ul.appendChild(item);
      item.setTodo(todo);
    }
  }

  connectedCallback() {
    this.addEventListener('todo:added', this.handleAdded);
    this.addEventListener('todo:added:rollback', this.handleAddRollback);
    this.addEventListener('todo:toggle', this.handleToggle);
    this.addEventListener('todo:edit', this.handleEdit);
    this.addEventListener('todo:delete', this.handleDelete);
    this.addEventListener('todo:update', this.handleUpdate);
    this.addEventListener('todo:cancel', this.handleCancel);
  }

  disconnectedCallback() {
    this.removeEventListener('todo:added', this.handleAdded);
    this.removeEventListener('todo:added:rollback', this.handleAddRollback);
    this.removeEventListener('todo:toggle', this.handleToggle);
    this.removeEventListener('todo:edit', this.handleEdit);
    this.removeEventListener('todo:delete', this.handleDelete);
    this.removeEventListener('todo:update', this.handleUpdate);
    this.removeEventListener('todo:cancel', this.handleCancel);
  }

  @errorDispatch('todo:error')
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

  @errorDispatch('todo:error')
  private async handleAddRollback() {
    await this.render();
  }

  @errorDispatch('todo:error')
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

  @errorDispatch('todo:error')
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

  @errorDispatch('todo:error')
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
    if (editEl === null) return;

    const original = (editEl as TodoEdit).getOriginalItem();
    if (original === null) return;

    editEl.replaceWith(original);
  };

  @errorDispatch('todo:error')
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
