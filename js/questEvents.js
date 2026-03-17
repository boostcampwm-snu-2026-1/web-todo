import { acceptQuest, abandonQuest, getQuests, toggleQuest } from "./questState.js";
import { renderApp } from "./questRender.js";
import { saveQuests } from "./storage.js";

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

function handleQuestSubmit(event) {
  event.preventDefault();

  const inputValue = elements.questInput.value;
  const newQuest = acceptQuest(inputValue);

  if (!newQuest) {
    elements.questInput.focus();
    return;
  }

  saveQuests(getQuests());
  renderApp();

  elements.questInput.value = "";
  elements.questInput.focus();
}

function handleQuestClick(event) {
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

  if (action === "complete") {
    toggleQuest(id);
  } else if (action === "abandon") {
    abandonQuest(id);
  } else {
    return;
  }

  saveQuests(getQuests());
  renderApp();
}