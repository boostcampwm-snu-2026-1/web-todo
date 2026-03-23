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
    content: String(quest.content ?? "").trim(),
    completed: Boolean(quest.completed),
  }));
}

export function normalizeQuestContent(content) {
  return String(content ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

export function addQuest(quest) {
  const normalizedQuest = {
    id: String(quest.id),
    content: normalizeQuestContent(quest.content),
    completed: Boolean(quest.completed),
  };

  quests = [normalizedQuest, ...quests];
  return normalizedQuest;
}

export function replaceQuest(updatedQuest) {
  const normalizedQuest = {
    id: String(updatedQuest.id),
    content: normalizeQuestContent(updatedQuest.content),
    completed: Boolean(updatedQuest.completed),
  };

  quests = quests.map((quest) =>
    quest.id === normalizedQuest.id ? normalizedQuest : quest
  );

  return normalizedQuest;
}

export function removeQuestById(id) {
  const targetId = String(id);
  quests = quests.filter((quest) => quest.id !== targetId);
}

export function findQuestById(id) {
  const targetId = String(id);
  return quests.find((quest) => quest.id === targetId) ?? null;
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
