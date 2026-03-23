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
            completed: false
        })
    })
    .then((res) => res.json())
    return(response)
}

export async function deleteTodo(id) {
    const response = await fetch(`https://69b9371be69653ffe6a6eff1.mockapi.io/todos/${id}`, {
        method: "DELETE",
    })
    return(response)
}

export async function checkTodo(id, check) {
    const response = await fetch(`https://69b9371be69653ffe6a6eff1.mockapi.io/todos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: check
        })
    })
    return(response)
}