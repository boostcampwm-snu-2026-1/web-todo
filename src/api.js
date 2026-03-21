//https://69b92c3ee69653ffe6a6cc3c.mockapi.io/api/v1/

const BASE_URL = 'https://69b92c3ee69653ffe6a6cc3c.mockapi.io/api/v1/';

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
        return await response.json(); // get id number, meta data, receipt from server
    }
    catch(error){
        console.error("Failed to create", error);
    return [];
    }
}

export async function deleteTodo(id) {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, { // to pinpoint the id
            method: 'DELETE'
        });
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
        return await response.json();
    } catch (error) {
        console.error("Failed to update", error);
    }
}

//todo
//add updateTodo func