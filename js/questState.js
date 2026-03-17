let quests = [];

export function getQuests() {
  return [...quests];
}

export function setQuests(nextQuests) {
  if (!Array.isArray(nextQuests)) {
    quests = [];
    return;
  }

  quests = nextQuests.map((quest) => ({
    id: String(quest.id),
    text: String(quest.text ?? "").trim(),
    completed: Boolean(quest.completed),
  }));
}

export function acceptQuest(text) {
  const normalizedText = normalizeQuestText(text);

  if (!normalizedText) {
    return false;
  }

  const newQuest = {
    id: createQuestId(),
    text: normalizedText,
    completed: false,
  };

  quests = [newQuest, ...quests];
  return newQuest;
}

export function toggleQuest(id) {
  const targetId = String(id);
  let updatedQuest = null;

  quests = quests.map((quest) => {
    if (quest.id !== targetId) {
      return quest;
    }

    updatedQuest = {
      ...quest,
      completed: !quest.completed,
    };

    return updatedQuest;
  });

  return updatedQuest;
}

export function abandonQuest(id) {
  const targetId = String(id);
  const targetQuest = quests.find((quest) => quest.id === targetId);

  if (!targetQuest) {
    return false;
  }

  quests = quests.filter((quest) => quest.id !== targetId);
  return true;
}

export function getSortedQuests() {
  return [...quests].sort((a, b) => {
    if (a.completed !== b.completed) {
      return Number(a.completed) - Number(b.completed);
    }

    return Number(b.id) - Number(a.id);
  });
}

export function getQuestStats() {
  const totalCount = quests.length;
  const completedCount = quests.filter((quest) => quest.completed).length;
  const activeCount = totalCount - completedCount;
  const completionRate =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return {
    totalCount,
    activeCount,
    completedCount,
    completionRate,
  };
}

function normalizeQuestText(text) {
  return String(text ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function createQuestId() {
  return String(Date.now() + Math.floor(Math.random() * 1000));
}