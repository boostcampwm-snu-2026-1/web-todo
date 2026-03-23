const STORAGE_KEY = "maple-quest-todos";

export function loadQuests() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);

    if (!rawData) {
      return [];
    }

    const parsedData = JSON.parse(rawData);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("퀘스트 데이터를 불러오는 중 오류가 발생했습니다.", error);
    return [];
  }
}

export function saveQuests(quests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
  } catch (error) {
    console.error("퀘스트 데이터를 저장하는 중 오류가 발생했습니다.", error);
  }
}