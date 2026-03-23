import {
  addQuest,
  findQuestById,
  normalizeQuestContent,
  removeQuestById,
  replaceQuest,
} from "./questState.js";
import { renderApp } from "./questRender.js";
import { createTodo, deleteTodo, updateTodo } from "./api.js";

let elements = null;

export function setEventElements(nextElements) {
  elements = nextElements;
}

export function bindQuestEvents() {
  if (!elements) {
    throw new Error("이벤트에 필요한 DOM 요소가 설정되지 않았습니다.");
  }

  elements.questForm.addEventListener("submit", handleQuestSubmit);
  elements.questList.addEventListener("click", handleQuestClick);
}

async function handleQuestSubmit(event) {
  event.preventDefault();

  const inputValue = normalizeQuestContent(elements.questInput.value);

  if (!inputValue) {
    elements.questInput.focus();
    return;
  }

  try {
    const createdQuest = await createTodo(inputValue);
    addQuest(createdQuest);
    renderApp();

    elements.questInput.value = "";
    elements.questInput.focus();
  } catch (error) {
    console.error(error);
    alert("퀘스트를 추가하지 못했습니다.");
  }
}

async function handleQuestClick(event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const questItem = button.closest(".quest-item");

  if (!questItem) {
    return;
  }

  const { action } = button.dataset;
  const { id } = questItem.dataset;

  if (!action || !id) {
    return;
  }

  try {
    if (action === "complete") {
      const targetQuest = findQuestById(id);

      if (!targetQuest) {
        return;
      }

      const updatedQuest = await updateTodo({
        ...targetQuest,
        completed: !targetQuest.completed,
      });

      replaceQuest(updatedQuest);
    } else if (action === "abandon") {
      await deleteTodo(id);
      removeQuestById(id);
    } else {
      return;
    }

    renderApp();
  } catch (error) {
    console.error(error);
    alert("퀘스트 처리 중 오류가 발생했습니다.");
  }
}