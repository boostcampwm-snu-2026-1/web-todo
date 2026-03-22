import type { DetailedError } from '../../domain/detailed-error';
import { ERROR_MESSAGES } from '../assets/detailed-error-message';
import { customElement } from '../decorators/custom-element';

@customElement('error-modal')
export class ErrorModal extends HTMLElement {
  show(error: DetailedError) {
    const message = ERROR_MESSAGES[error] ?? '알 수 없는 오류가 발생했어요.';
    this.render(message);
    this.querySelector('dialog')?.showModal();
  }

  private render(message: string) {
    this.innerHTML = /* html */ `
      <dialog class="error-modal">
        <p class="error-modal-message">${message}</p>
        <button class="error-modal-close">확인</button>
      </dialog>
    `;
  }

  connectedCallback() {
    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
  }

  private handleClick = (e: MouseEvent) => {
    if (!(e.target instanceof Element)) {
      return;
    }
    if (e.target.closest('.error-modal-close')) {
      this.querySelector('dialog')?.close();
    }
  };
}
