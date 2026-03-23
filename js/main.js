import { fetchTodos } from "./api.js";
import { setQuests } from "./questState.js";
import { setRenderElements, renderApp } from "./questRender.js";
import { setEventElements, bindQuestEvents } from "./questEvents.js";

function getDomElements() {
  return {
    questForm: document.querySelector("#questForm"),
    questInput: document.querySelector("#questInput"),
    questList: document.querySelector("#questList"),
    questEmptyMessage: document.querySelector("#questEmptyMessage"),
    totalQuestCount: document.querySelector("#totalQuestCount"),
    activeQuestCount: document.querySelector("#activeQuestCount"),
    completedQuestCount: document.querySelector("#completedQuestCount"),
    questProgressFill: document.querySelector("#questProgressFill"),
    questProgressText: document.querySelector("#questProgressText"),
    questStatusMessage: document.querySelector("#questStatusMessage"),
    questProgressBar: document.querySelector(".quest-progress"),
  };
}

function validateElements(elements) {
  const missingEntries = Object.entries(elements).filter(([, value]) => !value);

  if (missingEntries.length > 0) {
    const missingKeys = missingEntries.map(([key]) => key).join(", ");
    throw new Error(`필수 DOM 요소를 찾을 수 없습니다: ${missingKeys}`);
  }
}

async function init() {
  const elements = getDomElements();
  validateElements(elements);

  setRenderElements(elements);
  setEventElements(elements);

  try {
    const todos = await fetchTodos();
    setQuests(todos);
  } catch (error) {
    console.error(error);
    setQuests([]);
    alert("할 일 목록을 불러오지 못했습니다.");
  }

  renderApp();
  bindQuestEvents();
}

init();