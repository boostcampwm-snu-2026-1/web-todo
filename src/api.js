export async function getTodo () {
    const response = await fetch("https://69b9371be69653ffe6a6eff1.mockapi.io/todos");
    return(response.json());
}

export async function addTodo(content) {
    const response = await fetch("https://69b9371be69653ffe6a6eff1.mockapi.io/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            content: content,
            completes: false
        })
    })
    .then((res) => res.json())
    return(response)
}