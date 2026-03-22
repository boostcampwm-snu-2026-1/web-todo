/**
 * render.js — DOM 렌더링 모듈
 *
 * store.js의 상태(todos, currentFilter)를 읽어서 화면을 그리는 함수들의 모음.
 * 이 모듈의 함수들은 상태를 직접 바꾸지 않는다 — 오직 "그리기"만 담당한다.
 *
 * DOM 요소는 모듈 로드 시점에 한 번만 조회해 변수에 캐싱해두어
 * 매번 querySelector를 호출하는 비용을 줄인다.
 * (type="module" 스크립트는 기본 defer 동작을 하므로
 *  HTML 파싱이 끝난 뒤 실행되어 이 시점에 요소가 반드시 존재한다.)
 *
 * 다른 모듈에서 import해 사용한다:
 *   import { renderAll, renderList, renderStats } from './render.js';
 */

import { getFilteredTodos, getDoneCount, getTotalCount } from './store.js';


/* ════════════════════════════════════════════
   DOM 요소 캐싱
   ────────────────────────────────────────────
   모듈이 처음 로드될 때 딱 한 번 조회한 뒤 변수에 저장한다.
   이후 renderList, renderStats가 호출될 때마다 재사용한다.
════════════════════════════════════════════ */

/** 할일 목록을 렌더링할 <ul> 요소 */
const listEl     = document.getElementById('todo-list');

/** 헤더의 "완료된 개수" 숫자 요소 */
const statsDone  = document.getElementById('stats-done');

/** 헤더의 "전체 개수" 숫자 요소 */
const statsTotal = document.getElementById('stats-total');


/* ════════════════════════════════════════════
   공개 렌더링 함수 (export)
════════════════════════════════════════════ */

/**
 * 목록과 통계를 모두 새로 그린다.
 * 상태가 크게 바뀌었을 때(추가·삭제·필터 변경) 호출한다.
 */
export function renderAll() {
  renderList();
  renderStats();
}

/**
 * 할일 목록(<ul>)을 현재 필터에 맞게 다시 그린다.
 *
 * DocumentFragment를 사용하는 이유:
 *   DOM에 요소를 하나씩 추가하면 매번 리플로우(레이아웃 재계산)가 발생한다.
 *   Fragment는 메모리 안에서 노드를 조립한 뒤 한 번에 DOM에 삽입하므로
 *   리플로우 횟수를 최소화할 수 있다.
 */
export function renderList() {
  const fragment = document.createDocumentFragment();

  // store에서 현재 필터에 맞는 목록을 가져와 각각 <li>로 변환한다
  getFilteredTodos().forEach(todo => {
    fragment.appendChild(createTodoItem(todo));
  });

  // replaceChildren: 기존 자식 노드를 전부 지우고 새 Fragment로 교체한다.
  // innerHTML = '' + appendChild보다 안전하고 깔끔하다.
  listEl.replaceChildren(fragment);
}

/**
 * 헤더의 완료/전체 숫자만 업데이트한다.
 * 목록 전체를 다시 그릴 필요 없이 숫자만 바뀔 때 사용한다.
 * (예: 체크박스 토글 시 — 목록 순서는 바뀌지 않으므로 통계만 갱신)
 */
export function renderStats() {
  statsDone.textContent  = getDoneCount();
  statsTotal.textContent = getTotalCount();
}


/* ════════════════════════════════════════════
   내부 헬퍼 함수 (비공개)
════════════════════════════════════════════ */

/**
 * 할일 데이터 하나를 받아 <li> 엘리먼트를 생성하고 반환한다.
 * export하지 않아 이 모듈 내부에서만 사용한다.
 *
 * 생성되는 구조:
 *   <li class="todo-item [done]" data-id="…">
 *     <input type="checkbox" data-action="toggle" />
 *     <span class="todo-text">…</span>
 *     <button data-action="delete">…</button>
 *   </li>
 *
 * data-action 속성을 이용해 events.js의 handleListClick(이벤트 위임)에서
 * 어떤 동작을 해야 할지 구분한다.
 *
 * @param {{ id: string, text: string, done: boolean }} todo
 * @returns {HTMLLIElement}
 */
function createTodoItem({ id, text, done }) {
  // ── <li> 컨테이너 ──
  const li = document.createElement('li');
  li.className = `todo-item${done ? ' done' : ''}`;
  li.dataset.id = id; // 이벤트 핸들러에서 이 id로 store를 조작한다

  // ── 체크박스 ──
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-check';
  checkbox.checked = done;
  checkbox.setAttribute('aria-label', `"${text}" 완료 토글`);
  checkbox.dataset.action = 'toggle'; // 클릭 시 토글 동작 식별용

  // ── 할일 텍스트 ──
  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = text; // innerHTML 대신 textContent로 XSS 방지

  // ── 삭제 버튼 ──
  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.type = 'button'; // form 안에 있어도 submit이 되지 않도록
  delBtn.setAttribute('aria-label', `"${text}" 삭제`);
  delBtn.dataset.action = 'delete'; // 클릭 시 삭제 동작 식별용
  // SVG 아이콘: 접근성 트리에서 숨기고(aria-hidden) 시각적 역할만 한다
  delBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  // 세 자식 노드를 <li>에 한 번에 추가
  li.append(checkbox, span, delBtn);
  return li;
}
