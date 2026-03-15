(function () {
  'use strict';

  // --- 상태 (단일 책임: 데이터 변경만) ---
  var todos = [];

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function getTodos() {
    return todos;
  }

  function addTodo(text) {
    var trimmed = typeof text === 'string' ? text.trim() : '';
    if (!trimmed) return null;
    var item = { id: generateId(), text: trimmed, done: false };
    todos.push(item);
    return item;
  }

  function toggleTodo(id) {
    var item = todos.find(function (t) { return t.id === id; });
    if (item) item.done = !item.done;
    return item;
  }

  function deleteTodo(id) {
    var idx = todos.findIndex(function (t) { return t.id === id; });
    if (idx === -1) return false;
    todos.splice(idx, 1);
    return true;
  }

  var editingId = null;

  function getEditingId() {
    return editingId;
  }

  function setEditingId(id) {
    editingId = id;
  }

  function updateTodo(id, text) {
    var trimmed = typeof text === 'string' ? text.trim() : '';
    var item = todos.find(function (t) { return t.id === id; });
    if (!item) return null;
    if (trimmed) item.text = trimmed;
    return item;
  }

  // --- DOM 유틸 (단일 책임: DOM 조회/입력값) ---
  function getInputElement() {
    return document.getElementById('todo-input');
  }

  function getInputValue() {
    var el = getInputElement();
    return el ? el.value : '';
  }

  function clearInput() {
    var el = getInputElement();
    if (el) el.value = '';
  }

  function getListElement() {
    return document.getElementById('todo-list');
  }

  // --- 렌더 (단일 책임: DOM 갱신만) ---
  function createTodoElement(todo) {
    var li = document.createElement('li');
    li.className = 'todo-item';
    li.setAttribute('data-id', todo.id);
    if (todo.done) li.classList.add('todo-item--done');

    var isEditing = todo.id === getEditingId();

    if (isEditing) {
      li.classList.add('todo-item--editing');
      var check = document.createElement('input');
      check.type = 'checkbox';
      check.className = 'todo-check';
      check.checked = todo.done;
      check.setAttribute('aria-label', '완료 토글');
      check.setAttribute('data-action', 'toggle');
      check.disabled = true;

      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'todo-edit-input';
      input.value = todo.text;
      input.setAttribute('data-action', 'edit-input');
      input.setAttribute('aria-label', '할 일 수정');

      var saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'btn btn--save';
      saveBtn.textContent = '저장';
      saveBtn.setAttribute('aria-label', '저장');
      saveBtn.setAttribute('data-action', 'save');

      var cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn--cancel';
      cancelBtn.textContent = '취소';
      cancelBtn.setAttribute('aria-label', '취소');
      cancelBtn.setAttribute('data-action', 'cancel');

      li.appendChild(check);
      li.appendChild(input);
      li.appendChild(saveBtn);
      li.appendChild(cancelBtn);

      setTimeout(function () {
        input.focus();
        input.select();
      }, 0);

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveBtn.click();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          cancelBtn.click();
        }
      });

      return li;
    }

    var check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'todo-check';
    check.checked = todo.done;
    check.setAttribute('aria-label', '완료 토글');
    check.setAttribute('data-action', 'toggle');

    var text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    var editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn--edit';
    editBtn.textContent = '편집';
    editBtn.setAttribute('aria-label', '편집');
    editBtn.setAttribute('data-action', 'edit');

    var delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn--delete';
    delBtn.textContent = '삭제';
    delBtn.setAttribute('aria-label', '삭제');
    delBtn.setAttribute('data-action', 'delete');

    li.appendChild(check);
    li.appendChild(text);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    return li;
  }

  function renderTodoList() {
    var listEl = getListElement();
    if (!listEl) return;
    var items = getTodos();
    listEl.replaceChildren.apply(listEl, items.map(createTodoElement));
  }

  // --- 이벤트 핸들러 (단일 책임: 이벤트 수신 후 상태/렌더 호출) ---
  function handleSubmit(e) {
    e.preventDefault();
    var value = getInputValue();
    addTodo(value);
    clearInput();
    renderTodoList();
  }

  function getEditInputValue(item) {
    var input = item ? item.querySelector('.todo-edit-input') : null;
    return input ? input.value : '';
  }

  function handleListClick(e) {
    var target = e.target;
    var item = target.closest('.todo-item');
    if (!item) return;
    var id = item.getAttribute('data-id');
    var action = target.getAttribute('data-action');
    if (action === 'toggle') {
      toggleTodo(id);
      renderTodoList();
    } else if (action === 'delete') {
      deleteTodo(id);
      setEditingId(null);
      renderTodoList();
    } else if (action === 'edit') {
      setEditingId(id);
      renderTodoList();
    } else if (action === 'save') {
      var value = getEditInputValue(item);
      updateTodo(id, value);
      setEditingId(null);
      renderTodoList();
    } else if (action === 'cancel') {
      setEditingId(null);
      renderTodoList();
    }
  }

  function renderTodayDate() {
    var el = document.getElementById('today-date');
    if (!el) return;
    var d = new Date();
    el.textContent = d.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // --- 진입점: 이벤트 바인딩 ---
  function init() {
    renderTodayDate();
    var form = document.getElementById('todo-form');
    var list = getListElement();
    if (form) form.addEventListener('submit', handleSubmit);
    if (list) list.addEventListener('click', handleListClick);
    renderTodoList();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
