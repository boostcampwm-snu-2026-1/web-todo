const todoValue = document.getElementById("todo-input"),
    listItems = document.getElementById("todo-list"),
    addUpdateClick = document.getElementById("AddUpdateClick");
    

    todoValue.addEventListener("keypress", function(e){ // enter 누를 때도 list에 추가
        if(e.key === "Enter"){
            addUpdateClick.click();
        }
    });

function CreateToDoData() {
    if(todoValue.value===""){
        alert("Please Enter your todo text");
        todoValue.focus(); // ?
    }

    let li = document.createElement("li");
        const todoItems = `<div title="Hit Double Click and Complete" ondblclick="CompletedToDoItems(this)">${todoValue.value}</div><div>
                    <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="image/pencil.png" />
                    <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="image/delete.png" /></div></div>`; // class의 어미 부분만 같아도 같은 클래스??
    li.innerHTML = todoItems;
    listItems.appendChild(li);
    todoValue.value = "";

}



