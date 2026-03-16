import type { TodoUsecase } from '../../domain/todo-interface';
import { inject } from '../decorators/attr';
import { customElement } from '../decorators/custom-element';
import { errorDispatch } from '../decorators/event';
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
    this.addEventListener('todo:toggle', this.handleToggle);
    this.addEventListener('todo:edit', this.handleEdit);
    this.addEventListener('todo:delete', this.handleDelete);
    this.addEventListener('todo:update', this.handleUpdate);
    this.addEventListener('todo:cancel', this.handleCancel);
  }

  disconnectedCallback() {
    this.removeEventListener('todo:added', this.handleAdded);
    this.removeEventListener('todo:toggle', this.handleToggle);
    this.removeEventListener('todo:edit', this.handleEdit);
    this.removeEventListener('todo:delete', this.handleDelete);
    this.removeEventListener('todo:update', this.handleUpdate);
    this.removeEventListener('todo:cancel', this.handleCancel);
  }

  private async handleAdded() {
    await this.render();
  }

  @errorDispatch('todo:error')
  private async handleToggle(e: Event) {
    if (!(e instanceof CustomEvent)) return;
    const result = await this.todoUsecase.toggleTodo({
      id: Number(e.detail.id),
    });
    if (result.state === 'success') await this.render();
    return result;
  }

  @errorDispatch('todo:error')
  private async handleEdit(e: Event) {
    if (!(e instanceof CustomEvent)) return;
    if (!isTodoDetail(e.detail)) return;
    const { id } = e.detail;

    const item = this.querySelector(`todo-item[data-id="${id}"]`);
    if (item === null) return;

    const result = await this.todoUsecase.listTodos();
    if (result.state === 'error') return result;

    const todo = result.data.find((t) => String(t.id) === id);
    if (todo === undefined) return;

    const editEl = new TodoEdit();
    item.replaceWith(editEl);
    editEl.setTodo(todo);
    return result;
  }

  @errorDispatch('todo:error')
  private async handleUpdate(e: Event) {
    if (!(e instanceof CustomEvent)) return;
    if (!isTodoUpdateDetail(e.detail)) return;
    const { id, newContent } = e.detail;
    const result = await this.todoUsecase.updateTodo({
      id: Number(id),
      newContent,
    });
    if (result.state === 'success') await this.render();
    return result;
  }

  private handleCancel = async () => {
    await this.render();
  };

  @errorDispatch('todo:error')
  private async handleDelete(e: Event) {
    if (!(e instanceof CustomEvent)) return;
    if (!isTodoDetail(e.detail)) return;
    const result = await this.todoUsecase.deleteTodo({
      id: Number(e.detail.id),
    });
    if (result.state === 'success') await this.render();
    return result;
  }
}
