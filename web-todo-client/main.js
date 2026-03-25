import { initializeTodoApp } from "./js/app/todoController.js";

initializeTodoApp().catch((error) => {
  console.error("Failed to initialize app.", error);
});
