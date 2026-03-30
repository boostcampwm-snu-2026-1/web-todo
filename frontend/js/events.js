/**
 * events.js
 * 이벤트 등록 모듈 (단일책임: 이벤트 바인딩)
 *
 * 이벤트 위임(Event Delegation) 전략 사용:
 * - todo-list 전체에 단 하나의 click 리스너를 등록
 * - 새로 추가/삭제되는 아이템마다 리스너를 붙일 필요 없음
 * - 메모리 효율적이고 동적 렌더링에 강함
 */

/**
 * todo 리스트에 이벤트 위임으로 toggle/delete 등록
 * @param {HTMLElement} listEl
 * @param {{ onToggle: (id:string)=>void, onDelete: (id:string)=>void }} handlers
 */
export const bindListEvents = (listEl, { onToggle, onDelete }) => {
  listEl.addEventListener('click', (event) => {
    const target = event.target;
    const action = target.dataset.action;
    if (!action) return;

    const li = target.closest('[data-id]');
    if (!li) return;

    const id = li.dataset.id;

    if (action === 'toggle') onToggle(id);
    if (action === 'delete') onDelete(id);
  });
};

/**
 * todo 입력 폼 submit 이벤트 등록
 * @param {HTMLFormElement} formEl
 * @param {HTMLInputElement} inputEl
 * @param {(text:string)=>void} onSubmit
 */
export const bindFormSubmit = (formEl, inputEl, onSubmit) => {
  formEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    onSubmit(text);
    inputEl.value = '';
    inputEl.focus();
  });
};
