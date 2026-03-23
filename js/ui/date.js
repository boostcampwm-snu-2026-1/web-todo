export function formatTodayDate() {
  const now = new Date();
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const dayName = weekdays[now.getDay()];

  return `${month}월 ${date}일 ${dayName}`;
}

export function renderTodayDate() {
  const dateElement = document.getElementById("today-date");
  if (!dateElement) return;

  dateElement.textContent = formatTodayDate();
}
