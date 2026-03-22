fetch("https://69bfedb972ca04f3bcba1290.mockapi.io/todos")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })