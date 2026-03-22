/**
 * events.js — 이벤트 처리 모듈
 *
 * 사용자의 모든 상호작용(폼 제출, 체크박스 토글, 삭제, 필터 전환)을 여기서 처리한다.
 * store.js로 상태를 변경하고, render.js로 화면을 갱신하는 역할을 조율한다.
 *
 * 이벤트 위임(Event Delegation) 전략:
 *   할일 항목이 동적으로 추가·삭제되므로, 각 항목에 리스너를 달면
 *   항목이 바뀔 때마다 리스너를 다시 등록해야 한다.
 *   대신 부모인 <ul> 하나에만 클릭 리스너를 달아두면
 *   자식 항목의 클릭 이벤트가 버블링되어 올라오므로
 *   리스너 수를 줄이고 코드를 단순하게 유지할 수 있다.
 *
 * 다른 모듈에서 import해 사용한다:
 *   import { initEvents } from './events.js';
 */

import { postTodo, putTodo, removeTodo } from './api.js';
import { addTodo, insertTodo, toggleTodo, deleteTodo, clearDone, setFilter } from './store.js';
import { renderAll, renderList, renderStats } from './render.js';


/* ════════════════════════════════════════════
   DOM 요소 캐싱
   ────────────────────────────────────────────
   render.js와 마찬가지로 모듈 로드 시 한 번만 조회해 재사용한다.
════════════════════════════════════════════ */

/** 할일 입력 폼 요소 */
const form      = document.getElementById('todo-form');

/** 텍스트 입력창 요소 */
const input     = document.getElementById('todo-input');

/** "완료 항목 삭제" 버튼 요소 */
const clearBtn  = document.getElementById('clear-done-btn');

/** 필터 버튼들을 감싸는 <nav> 요소 */
const filterBar = document.querySelector('.filter-bar');

/** 할일 목록 <ul> — 이벤트 위임의 기준 요소 */
const listEl    = document.getElementById('todo-list');


/* ════════════════════════════════════════════
   공개 초기화 함수 (export)
════════════════════════════════════════════ */

/**
 * 앱에 필요한 모든 이벤트 리스너를 한 번에 등록한다.
 * main.js에서 initStore → renderAll 이후 마지막 단계로 호출된다.
 * 이 순서를 지켜야 DOM이 초기 데이터로 채워진 상태에서 이벤트가 활성화된다.
 */
export function initEvents() {
  form.addEventListener('submit', handleFormSubmit);       // 폼 제출 (할일 추가)
  listEl.addEventListener('click', handleListClick);       // 할일 토글·삭제 (위임)
  filterBar.addEventListener('click', handleFilterClick);  // 필터 전환 (위임)
  clearBtn.addEventListener('click', handleClearDone);     // 완료 항목 전체 삭제
  input.addEventListener('keydown', handleInputKeydown);   // 한국어 IME 이중 제출 방지
}


/* ════════════════════════════════════════════
   내부 이벤트 핸들러 (비공개)
════════════════════════════════════════════ */

/**
 * 폼 제출 처리 — 할일 추가.
 *
 * e.preventDefault()로 기본 동작(페이지 새로 고침)을 막는다.
 * 입력값을 먼저 검증한 뒤 서버에 POST 요청을 보낸다.
 *
 * 처리 흐름:
 *   1. 입력창이 비어 있으면 아무것도 하지 않는다.
 *   2. 입력창을 즉시 비워 연속 입력이 가능하게 한다.
 *   3. postTodo()로 서버에 새 항목을 생성한다.
 *       ├─ 성공 → insertTodo()로 서버가 부여한 id·createdAt을 그대로 store에 삽입
 *       └─ 실패 → addTodo()로 로컬에서 항목을 생성해 폴백 (서비스 지속성 보장)
 *   4. renderAll()로 목록과 통계를 갱신한다.
 *
 * async로 선언한 이유: postTodo()가 Promise를 반환하므로 await로 결과를 기다린다.
 * @param {SubmitEvent} e
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const trimmed = input.value.trim();
  if (!trimmed) return; // 빈 입력이면 무시

  input.value = ''; // 입력창을 먼저 비워 빠른 연속 입력을 허용

  try {
    const todo = await postTodo(trimmed); // 서버에 POST 요청
    insertTodo(todo);                     // 서버가 부여한 id·createdAt으로 store에 삽입
  } catch (err) {
    // 네트워크 오류 등 POST 실패 시 로컬에서 항목 생성 (폴백)
    console.warn('POST 실패, 로컬에서 항목을 생성합니다.', err.message);
    addTodo(trimmed);
  }

  renderAll();
}

/**
 * 할일 목록 클릭 처리 — 이벤트 위임.
 *
 * 클릭된 요소의 data-action 속성을 보고 동작을 분기한다:
 *   - 'toggle' : 체크박스 클릭 → 낙관적 UI 업데이트 후 PUT 요청
 *   - 'delete' : 삭제 버튼 클릭 → 애니메이션 후 DELETE 요청
 *
 * closest()를 쓰는 이유:
 *   SVG 내부의 path 같은 자식 요소를 클릭해도 올바르게 동작하도록
 *   클릭 대상에서 가장 가까운 [data-action] 조상을 탐색한다.
 *
 * async로 선언한 이유: putTodo·removeTodo가 Promise를 반환하므로 await로 기다린다.
 * @param {MouseEvent} e
 */
async function handleListClick(e) {
  // 클릭된 위치에서 가장 가까운 .todo-item을 찾는다
  const item = e.target.closest('.todo-item');
  if (!item) return; // 빈 영역 클릭이면 무시

  const id     = item.dataset.id;
  const action = e.target.closest('[data-action]')?.dataset.action;

  if (action === 'toggle') {
    // 체크박스는 브라우저가 이미 시각적으로 변경했으므로 checked 값이 새 상태다
    const checkbox = item.querySelector('.todo-check');
    const newDone  = checkbox.checked;

    // ── 낙관적 업데이트: 서버 응답을 기다리지 않고 UI를 먼저 반영 ──
    // 사용자가 즉각적인 피드백을 느낄 수 있도록 한다.
    toggleTodo(id);
    item.classList.toggle('done', newDone);
    renderStats();

    try {
      // 서버에 새 완료 상태를 반영한다 (PUT /todos/:id)
      await putTodo(id, newDone);
    } catch (err) {
      // PUT 실패 시: store와 UI를 원래 상태로 되돌린다 (롤백)
      console.warn('PUT 실패, 롤백합니다.', err.message);
      toggleTodo(id);                        // store 롤백
      checkbox.checked = !newDone;           // 체크박스 롤백
      item.classList.toggle('done', !newDone); // 클래스 롤백
      renderStats();
    }
    return;
  }

  if (action === 'delete') {
    // CSS 트랜지션으로 페이드 아웃 + 오른쪽으로 슬라이드
    item.style.transition = 'opacity 0.18s, transform 0.18s';
    item.style.opacity    = '0';
    item.style.transform  = 'translateX(8px)';

    // 애니메이션이 끝난 뒤 DELETE 요청을 보낸다.
    // { once: true }로 리스너가 한 번만 실행되게 해 메모리 누수를 막는다.
    item.addEventListener('transitionend', async () => {
      try {
        await removeTodo(id); // 서버에서 삭제 (DELETE /todos/:id)
        deleteTodo(id);       // store에서도 제거
      } catch (err) {
        // DELETE 실패 시: store에 항목이 남아 있으므로 renderAll이 화면을 복원한다
        console.warn('DELETE 실패, 항목을 복원합니다.', err.message);
      }
      renderAll(); // 성공·실패 모두 화면 갱신 (실패 시 복원 역할)
    }, { once: true });
  }
}

/**
 * 필터 버튼 클릭 처리 — 이벤트 위임.
 *
 * 클릭된 버튼의 data-filter 값으로 필터를 바꾸고
 * 활성 버튼의 스타일(active 클래스, aria-selected)을 업데이트한다.
 * @param {MouseEvent} e
 */
function handleFilterClick(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  const filter = btn.dataset.filter;
  if (!filter) return;

  // 모든 필터 버튼을 순회해 활성 상태를 재설정한다
  document.querySelectorAll('.filter-btn').forEach(b => {
    const isActive = b === btn;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', String(isActive)); // 스크린 리더 접근성
  });

  setFilter(filter);
  renderList(); // 필터만 바뀌므로 목록만 다시 그린다 (통계는 변하지 않음)
}

/**
 * "완료 항목 삭제" 버튼 클릭 처리.
 * store에서 완료 항목을 제거하고 전체 화면을 다시 그린다.
 */
function handleClearDone() {
  clearDone();
  renderAll();
}

/**
 * 한국어 IME 이중 제출 방지.
 *
 * 한국어를 입력하고 Enter를 누르면 두 가지 일이 동시에 일어날 수 있다:
 *   1. IME가 조합 중인 글자를 확정(commit)한다.
 *   2. 폼이 제출된다.
 *
 * e.isComposing이 true이면 아직 IME가 글자를 조합하는 중이므로
 * 이때 Enter의 기본 동작(폼 제출)을 막아 이중 제출을 방지한다.
 * 조합이 끝난 뒤 Enter를 한 번 더 누르면 정상 제출된다.
 *
 * @param {KeyboardEvent} e
 */
function handleInputKeydown(e) {
  if (e.key === 'Enter' && e.isComposing) {
    e.preventDefault();
  }
}
