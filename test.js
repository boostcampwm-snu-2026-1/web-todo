fetch("https://69bfedb972ca04f3bcba1290.mockapi.io/todos")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })

fetch("https://69bfedb972ca04f3bcba1290.mockapi.io/todos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: "html 공부하기",
    completed: false
  })
})
  .then(response => response.json())
  .then(newTodo => {
    console.log(newTodo);
  });