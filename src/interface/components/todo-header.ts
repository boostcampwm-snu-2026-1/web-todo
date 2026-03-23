import type { DateUsecase } from '../../domain/date-interface';
import { COMPONENT_TAGS } from '../assets/tag-name';
import { inject } from '../decorators/attr';
import { customElement } from '../decorators/custom-element';

@customElement(COMPONENT_TAGS.TODO_HEADER)
export class TodoHeader extends HTMLElement {
  @inject<DateUsecase>('dateUsecase')
  accessor dateUsecase!: DateUsecase;

  connectedCallback() {
    this.innerHTML = this.template();
  }

  render() {
    const dateEl = this.querySelector('.date');
    if (dateEl === null) {
      return;
    }
    dateEl.textContent = this.dateUsecase.getNow();
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
