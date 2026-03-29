const BASE_URL = 'http://localhost:3000/todos';

export async function getTodo() {
    try {
        const response = await fetch(BASE_URL);
        if(!response.ok) throw new Error("Network error");

        return await response.json();
    }
    catch(error){
        console.error("Failed to fecth todo", error);
        return [];
    }
}

export async function createTodo(itemText) {
    try{
        const response = await fetch(BASE_URL, {
            method : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item: itemText,
                completed: false
            })
        });
        if (!response.ok) throw new Error("Failed to create");
        return await response.json();
    }
    catch(error){
        console.error("Failed to create", error);
    return [];
    }
}

export async function deleteTodo(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete");
        return await response.json();
    } catch (error) {
        console.error("Failed to delete", error);
    }
}

export async function toggleTodo(id, isCompleted) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: isCompleted })
        });
        if (!response.ok) throw new Error("Failed to toggle");
        return await response.json();
    } catch (error) {
        console.error("Failed to toggle", error);
    }
}

export async function updateTodo(id, updateText, isCompleted){
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item : updateText,
                completed: isCompleted
            })
        });
        if (!response.ok) throw new Error("Failed to update");
        return await response.json();
    } catch (error) {
        console.error("Failed to update", error);
    }
}
