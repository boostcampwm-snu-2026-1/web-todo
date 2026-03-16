import type { DateUsecase } from '../../domain/date-interface';
import { inject } from '../decorators/attr';
import { customElement } from '../decorators/custom-element';

@customElement('todo-header')
export class TodoHeader extends HTMLElement {
  @inject<DateUsecase>('dateUsecase')
  accessor dateUsecase!: DateUsecase;

  connectedCallback() {
    this.innerHTML = this.template();
  }

  render() {
    this.querySelector('.date')!.textContent = this.dateUsecase.getNow();
  }

  private template() {
    return /* html */ `
      <div class="card-header">
        <h1>Today's Tasks</h1>
        <p class="date"></p>
      </div>
    `;
  }
}
