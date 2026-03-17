import { getQuestStats, getSortedQuests } from "./questState.js";

let elements = null;

export function setRenderElements(nextElements) {
  elements = nextElements;
}

export function renderApp() {
  if (!elements) {
    throw new Error("렌더링에 필요한 DOM 요소가 설정되지 않았습니다.");
  }

  const quests = getSortedQuests();
  const stats = getQuestStats();

  renderQuestList(quests);
  renderEmptyState(stats.totalCount);
  renderQuestStatus(stats);
}

function renderQuestList(quests) {
  elements.questList.innerHTML = "";

  const fragment = document.createDocumentFragment();

  quests.forEach((quest) => {
    const questItem = createQuestItem(quest);
    fragment.append(questItem);
  });

  elements.questList.append(fragment);
}

function createQuestItem(quest) {
  const item = document.createElement("li");
  item.classList.add("quest-item");
  item.dataset.id = quest.id;

  if (quest.completed) {
    item.classList.add("quest-item--completed");
  }

  const main = document.createElement("div");
  main.classList.add("quest-item__main");

  const title = document.createElement("p");
  title.classList.add("quest-item__title");
  title.textContent = `${quest.completed ? "⭐" : "📜"} ${quest.text}`;

  const status = document.createElement("span");
  status.classList.add("quest-item__status");

  if (quest.completed) {
    status.classList.add("quest-item__status--completed");
    status.textContent = "클리어";
  } else {
    status.textContent = "진행 중";
  }

  main.append(title, status);

  const actions = document.createElement("div");
  actions.classList.add("quest-item__actions");

  const completeButton = document.createElement("button");
  completeButton.type = "button";
  completeButton.classList.add(
    "quest-item__button",
    "quest-item__button--complete"
  );
  completeButton.dataset.action = "complete";
  completeButton.textContent = quest.completed ? "완료 취소" : "완료 처리";

  const abandonButton = document.createElement("button");
  abandonButton.type = "button";
  abandonButton.classList.add(
    "quest-item__button",
    "quest-item__button--abandon"
  );
  abandonButton.dataset.action = "abandon";
  abandonButton.textContent = "퀘스트 포기";

  actions.append(completeButton, abandonButton);
  item.append(main, actions);

  return item;
}

function renderEmptyState(totalCount) {
  const isEmpty = totalCount === 0;
  elements.questEmptyMessage.hidden = !isEmpty;
  elements.questList.hidden = isEmpty;
}

function renderQuestStatus(stats) {
  elements.totalQuestCount.textContent = String(stats.totalCount);
  elements.activeQuestCount.textContent = String(stats.activeCount);
  elements.completedQuestCount.textContent = String(stats.completedCount);

  elements.questProgressFill.style.width = `${stats.completionRate}%`;
  elements.questProgressText.textContent = `달성률 ${stats.completionRate}%`;

  if (elements.questProgressBar) {
    elements.questProgressBar.setAttribute(
      "aria-valuenow",
      String(stats.completionRate)
    );
  }

  elements.questStatusMessage.textContent = getStatusMessage(stats);
}

function getStatusMessage(stats) {
  if (stats.totalCount === 0) {
    return "새로운 의뢰를 받아 보세요!";
  }

  if (stats.completedCount === 0) {
    return "첫 퀘스트를 시작해 볼까요?";
  }

  if (stats.completedCount === stats.totalCount) {
    return "오늘의 퀘스트를 모두 클리어했습니다!";
  }

  if (stats.completionRate >= 70) {
    return "모험이 순조롭게 진행되고 있어요!";
  }

  return "차근차근 퀘스트를 해결해 보세요!";
}