let toastTimeoutId = null;

export function showToastMessage(message) {
  const toastElement = document.getElementById("toast-message");
  if (!toastElement) return;

  toastElement.textContent = message;
  toastElement.classList.add("show");

  if (toastTimeoutId !== null) {
    clearTimeout(toastTimeoutId);
  }

  toastTimeoutId = window.setTimeout(() => {
    toastElement.classList.remove("show");
    toastTimeoutId = null;
  }, 1000);
}
