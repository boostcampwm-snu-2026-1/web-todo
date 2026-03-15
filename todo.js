/**
 * todo.js — Seonuk's TODO 앱 전체 로직
 *
 * 이 파일 하나에 상태 관리, 화면 렌더링, 이벤트 처리가 모두 담겨 있다.
 * ES 모듈(import/export)을 사용하지 않아 로컬 파일(file://)로 바로 열 수 있다.
 *
 * 크게 세 영역으로 나뉜다:
 *   1. 상태 관리  — 할일 목록을 메모리에 유지하고 localStorage에 저장한다.
 *   2. DOM 렌더링 — 현재 상태를 읽어 화면을 그린다.
 *   3. 이벤트 처리 — 사용자 입력을 받아 상태를 바꾸고 화면을 갱신한다.
 *
 * 실행 흐름:
 *   initStore() → renderAll() → initEvents()
 *   이후에는 "이벤트 발생 → 상태 변경 → 화면 갱신" 사이클이 반복된다.
 */


/* ════════════════════════════════════════════
   1. 상태 관리 (Store)
   ────────────────────────────────────────────
   할일 데이터는 모두 이 영역의 변수(todos, currentFilter)에서 관리한다.
   외부에서 직접 변수를 건드리지 않고, 아래 함수들을 통해서만 읽고 쓴다.
   데이터가 바뀔 때마다 persist()를 호출해 localStorage에 자동 저장한다.
════════════════════════════════════════════ */

/** localStorage에서 데이터를 읽고 쓸 때 사용할 키 이름 */
const STORAGE_KEY = 'gruvbox-todos';

/**
 * 할일 목록 배열.
 * 각 항목의 구조: { id: string, text: string, done: boolean, createdAt: number }
 *   - id       : 항목을 식별하는 고유 UUID
 *   - text     : 할일 내용 (최대 120자)
 *   - done     : 완료 여부
 *   - createdAt: 생성 시각 (Unix timestamp, 밀리초)
 */
let todos = [];

/**
 * 현재 선택된 필터.
 * 'all'(전체) | 'active'(진행 중) | 'done'(완료) 세 가지 값을 가진다.
 */
let currentFilter = 'all';

/**
 * 앱 시작 시 localStorage에서 이전에 저장한 할일 목록을 복원한다.
 * JSON 파싱 오류(손상된 데이터 등)가 발생하면 빈 배열로 초기화한다.
 */
function initStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    todos = raw ? JSON.parse(raw) : [];
  } catch {
    todos = [];
  }
}

/**
 * 현재 필터에 맞는 할일 목록을 반환한다.
 * 원본 배열을 직접 반환하지 않고 복사본(스프레드)을 반환해
 * 외부에서 실수로 배열을 수정하는 것을 막는다.
 */
function getFilteredTodos() {
  switch (currentFilter) {
    case 'active': return todos.filter(t => !t.done);
    case 'done':   return todos.filter(t => t.done);
    default:       return [...todos];
  }
}

/** 전체 할일 개수를 반환한다 (통계 표시에 사용) */
function getTotalCount() { return todos.length; }

/** 완료된 할일 개수를 반환한다 (통계 표시에 사용) */
function getDoneCount()  { return todos.filter(t => t.done).length; }

/**
 * 새 할일을 목록 맨 앞에 추가한다 (최신 항목이 위에 표시되도록 unshift 사용).
 * 빈 문자열이면 추가하지 않고 false를 반환한다.
 * @param {string} text — 입력창에서 받은 할일 내용
 * @returns {boolean} 추가 성공 여부
 */
function addTodo(text) {
  const trimmed = text.trim(); // 앞뒤 공백 제거
  if (!trimmed) return false;  // 공백만 입력했으면 무시

  todos.unshift({
    id: crypto.randomUUID(), // 브라우저 내장 UUID 생성기로 고유 ID 부여
    text: trimmed,
    done: false,
    createdAt: Date.now(),
  });

  persist(); // 변경 사항을 localStorage에 즉시 저장
  return true;
}

/**
 * 특정 할일의 완료 상태를 반전시킨다 (완료 ↔ 미완료).
 * @param {string} id — 토글할 할일의 UUID
 */
function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.done = !todo.done;
  persist();
}

/**
 * 특정 할일을 목록에서 삭제한다.
 * filter로 새 배열을 만들어 참조를 교체하는 방식(불변성 패턴)을 사용한다.
 * @param {string} id — 삭제할 할일의 UUID
 */
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  persist();
}

/**
 * 완료된 할일을 모두 삭제한다.
 * 미완료 항목만 남기는 방식으로 동작한다.
 */
function clearDone() {
  todos = todos.filter(t => !t.done);
  persist();
}

/**
 * 현재 필터를 변경한다.
 * 필터는 UI 상태이므로 localStorage에는 저장하지 않는다
 * (페이지를 새로 고침하면 '전체'로 초기화되는 게 자연스럽다).
 * @param {'all'|'active'|'done'} filter
 */
function setFilter(filter) {
  currentFilter = filter;
}

/**
 * 현재 todos 배열을 JSON으로 직렬화해 localStorage에 저장한다.
 * 저장 용량 초과 등의 오류는 조용히 무시한다 (앱이 멈추면 안 되므로).
 */
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {}
}


/* ════════════════════════════════════════════
   2. DOM 렌더링 (Render)
   ────────────────────────────────────────────
   상태(todos, currentFilter)를 읽어서 화면을 그리는 함수들의 모음.
   이 영역의 함수들은 상태를 직접 바꾸지 않는다 — 오직 "그리기"만 담당한다.
   DOM 요소는 모듈 로드 시점에 한 번만 조회해 변수에 캐싱해두어
   매번 querySelector를 호출하는 비용을 줄인다.
════════════════════════════════════════════ */

/** 할일 목록을 렌더링할 <ul> 요소 */
const listEl     = document.getElementById('todo-list');

/** 헤더의 "완료된 개수" 숫자 요소 */
const statsDone  = document.getElementById('stats-done');

/** 헤더의 "전체 개수" 숫자 요소 */
const statsTotal = document.getElementById('stats-total');

/**
 * 목록과 통계를 모두 새로 그린다.
 * 상태가 크게 바뀌었을 때(추가·삭제·필터 변경) 호출한다.
 */
function renderAll() {
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
function renderList() {
  const fragment = document.createDocumentFragment();
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
 */
function renderStats() {
  statsDone.textContent  = getDoneCount();
  statsTotal.textContent = getTotalCount();
}

/**
 * 할일 데이터 하나를 받아 <li> 엘리먼트를 생성하고 반환한다.
 *
 * 생성되는 구조:
 *   <li class="todo-item [done]" data-id="…">
 *     <input type="checkbox" data-action="toggle" />
 *     <span class="todo-text">…</span>
 *     <button data-action="delete">…</button>
 *   </li>
 *
 * data-action 속성을 이용해 이벤트 위임(handleListClick)에서
 * 어떤 동작을 해야 할지 구분한다.
 *
 * @param {{ id: string, text: string, done: boolean }} todo
 * @returns {HTMLLIElement}
 */
function createTodoItem({ id, text, done }) {
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
  delBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;

  li.append(checkbox, span, delBtn);
  return li;
}


/* ════════════════════════════════════════════
   3. 이벤트 처리 (Events)
   ────────────────────────────────────────────
   사용자의 모든 상호작용을 여기서 처리한다.

   이벤트 위임(Event Delegation) 전략:
     할일 항목이 동적으로 추가·삭제되므로, 각 항목에 리스너를 달면
     항목이 바뀔 때마다 리스너를 다시 등록해야 한다.
     대신 부모인 <ul> 하나에만 클릭 리스너를 달아두면
     자식 항목의 클릭 이벤트가 버블링되어 올라오므로
     리스너 수를 줄이고 코드를 단순하게 유지할 수 있다.
════════════════════════════════════════════ */

/** 할일 입력 폼 요소 */
const form      = document.getElementById('todo-form');

/** 텍스트 입력창 요소 */
const input     = document.getElementById('todo-input');

/** "완료 항목 삭제" 버튼 요소 */
const clearBtn  = document.getElementById('clear-done-btn');

/** 필터 버튼들을 감싸는 <nav> 요소 */
const filterBar = document.querySelector('.filter-bar');

/**
 * 앱에 필요한 모든 이벤트 리스너를 한 번에 등록한다.
 * initStore, renderAll 이후에 호출해야 DOM이 준비된 상태에서 등록된다.
 */
function initEvents() {
  form.addEventListener('submit', handleFormSubmit);       // 폼 제출 (할일 추가)
  listEl.addEventListener('click', handleListClick);       // 할일 토글·삭제 (위임)
  filterBar.addEventListener('click', handleFilterClick);  // 필터 전환 (위임)
  clearBtn.addEventListener('click', handleClearDone);     // 완료 항목 전체 삭제
  input.addEventListener('keydown', handleInputKeydown);   // 한국어 IME 이중 제출 방지
}

/**
 * 폼 제출 처리 — 할일 추가.
 *
 * e.preventDefault()로 기본 동작(페이지 새로 고침)을 막고,
 * 입력값을 store에 넘긴다. 추가에 성공하면 입력창을 비우고 화면을 갱신한다.
 * @param {SubmitEvent} e
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const added = addTodo(input.value);
  if (added) {
    input.value = '';
    renderAll();
  }
}

/**
 * 할일 목록 클릭 처리 — 이벤트 위임.
 *
 * 클릭된 요소의 data-action 속성을 보고 동작을 분기한다:
 *   - 'toggle' : 체크박스 클릭 → 완료 상태 토글
 *   - 'delete' : 삭제 버튼 클릭 → 애니메이션 후 삭제
 *
 * closest()를 쓰는 이유:
 *   SVG 내부의 path 같은 자식 요소를 클릭해도 올바르게 동작하도록
 *   클릭 대상에서 가장 가까운 [data-action] 조상을 탐색한다.
 *
 * @param {MouseEvent} e
 */
function handleListClick(e) {
  // 클릭된 위치에서 가장 가까운 .todo-item을 찾는다
  const item = e.target.closest('.todo-item');
  if (!item) return; // 빈 영역 클릭이면 무시

  const id     = item.dataset.id;
  const action = e.target.closest('[data-action]')?.dataset.action;

  if (action === 'toggle') {
    toggleTodo(id); // store 상태 변경

    // 전체 목록을 다시 그리는 대신, 해당 <li>의 클래스만 갱신해 성능을 높인다.
    // 체크박스는 브라우저가 이미 시각적으로 변경했으므로 checked 값을 그대로 읽는다.
    const checkbox = item.querySelector('.todo-check');
    item.classList.toggle('done', checkbox.checked);
    renderStats(); // 통계 숫자만 업데이트
    return;
  }

  if (action === 'delete') {
    // CSS 트랜지션으로 페이드 아웃 + 오른쪽으로 슬라이드
    item.style.transition = 'opacity 0.18s, transform 0.18s';
    item.style.opacity    = '0';
    item.style.transform  = 'translateX(8px)';

    // 애니메이션이 끝난 뒤에 store에서 삭제하고 화면을 갱신한다.
    // { once: true }로 리스너가 한 번만 실행되게 해 메모리 누수를 막는다.
    item.addEventListener('transitionend', () => {
      deleteTodo(id);
      renderAll();
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


/* ════════════════════════════════════════════
   초기화 — 앱 시작점
   ────────────────────────────────────────────
   세 단계를 순서대로 실행한다:
     1. initStore()  : localStorage에서 데이터 복원
     2. renderAll()  : 복원된 데이터로 초기 화면 그리기
     3. initEvents() : 사용자 입력을 받을 준비 완료
════════════════════════════════════════════ */
initStore();
renderAll();
initEvents();
