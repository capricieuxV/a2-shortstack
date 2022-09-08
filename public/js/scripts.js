let selectAll = document.querySelector("#select_all_toggler");
let input = document.querySelector("#input");
let todoList = document.querySelector("#todo_list");
let showStates = document.querySelector(".state");
let counter = document.querySelector(".counter");
let clearBtn = document.querySelector("#delete");
let classify = document.querySelector("#classify_toggler");

classify.onclick = (e) => {
  if (e.target.matches("input")) {
    debugger;
    console.log(e);
    todoList.classList.remove("all", "incomplete", "complete");
    todoList.classList.add(e.target.value);
  }
};

selectAll.onclick = (e) => {
  let complete_item = todoList.querySelectorAll("li.complete");
  if (complete_item.length == todoList.children.length) {
    Array.from(todoList.children).forEach((it) => {
      it.classList.remove("complete");
      it.firstElementChild.checked = false;
    });
  } else {
    Array.from(todoList.children).forEach((it) => {
      it.classList.add("complete");
      it.firstElementChild.checked = true;
    });
  }
  setActions();
  refresh();
};

input.onkeyup = function (e) {
  if (e.key === "Enter") {
    add({
      content: e.target.value.trim(),
      complete: false,
    });
    e.target.value = "";
    refresh();
  }
};

clearBtn.onclick = (e) => {

  let tobeDeleted = document.querySelectorAll(".complete");
  tobeDeleted.forEach((it) => {
    todoList.removeChild(it);
  });

  let item = document.getElementById("delete");
  let json = {
    id: "delete",
  };
  let body = JSON.stringify(json);
  clearBtn.style.display = "none";

  fetch("/delete", {
    method: "POST",
    body,
  }).then(async function (response) {
    if (response.status === 200) {
      alert("clear successfully");
    } else {
      alert("issue found");
    }
    let responseInfo = await response.json();
    refresh(responseInfo);
    console.log(responseInfo);
  });

  return false;
};

function setActions() {
  let incompletes = todoList.querySelectorAll(
    "input:first-child:not(:checked)"
  );
  let complete_item = todoList.querySelectorAll("input:first-child:checked");
  if (incompletes.length) {
    selectAll.checked = false;
  } else {
    selectAll.checked = true;
  }
  counter.textContent = incompletes.length + " to finish";
  if (complete_item.length) {
    clearBtn.style.display = "inline-block";
  } else {
    clearBtn.style.display = "none";
  }
}

let todos = JSON.parse(localStorage.todos) || [];

todos.forEach((todo) => {
  add(todo);
});

function add(todo) {
  let todoText = todo.content;
  if (todoText.trim() !== "") {
    this.value = "";
    let li = document.createElement("li");
    li.classList.add("item_todo");
    todo.complete && li.classList.add("complete");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.complete;

    checkbox.onchange = (e) => {
      if (checkbox.checked) {
        li.classList.add("complete");
      } else {
        li.classList.remove("complete");
      }
      setActions();
      refresh();
    };

    let span = document.createElement("span");
    span.textContent = todoText;
    span.ondblclick = (e) => {
      li.classList.add("editing");
      setTimeout(() => {
        editBox.focus();
      });
    };

    let editBox = document.createElement("input");
    editBox.type = "text";
    editBox.value = todoText;
    editBox.onkeyup = (e) => {
      if (e.key == "Enter") {
        span.textContent = editBox.value;
        li.classList.remove("editing");
        refresh();
      }
    };
    editBox.onblur = (e) => {
      span.textContent = editBox.value;
      li.classList.remove("editing");
      refresh();
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.onclick = (e) => {
      todoList.removeChild(li);
      setActions();
      if (todoList.children.length == 0) {
        showStates.style.display = "none";
      }
      refresh();
    };

    li.append(checkbox, span, editBox, deleteBtn);
    todoList.append(li);
    setActions();
  }

  let status = document.querySelector(".state");
  let content = document.querySelector("#input");
  let json = {
    complete: status.value,
    content: content.value,
  };
  let body = JSON.stringify(json);
  fetch("/submit", {
    method: "POST",
    body,
  }).then(async function (response) {
    let responseInfo = await response.json();
    refresh(responseInfo);
    console.log(responseInfo);
  });

  return false;
}

function refresh() {
  let todos = Array.from(todoList.children).map((li) => {
    return {
      complete: li.firstElementChild.checked,
      content: li.firstElementChild.nextElementSibling.textContent,
    };
  });
  console.log(todos);
  localStorage.todos = JSON.stringify(todos);
}
