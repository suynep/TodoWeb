const historyContainer = document.getElementById("todoHistoryContainer");

function deleteTodoElement(todoId) {
  const toDelete = document.getElementById(todoId);
  historyContainer.removeChild(toDelete);
}

function createTodoElement(todoTitle, todoText) {
  const cardRoot = document.createElement("div");
  cardRoot.classList.add("card");
  cardRoot.id = Date.now();
  cardRoot.style["width"] = "15rem";

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardRoot.appendChild(cardBody);

  const cardTitle = document.createElement("h4");
  cardTitle.classList.add("card-title");
  cardTitle.innerText = "Todo: " + todoTitle;
  cardBody.appendChild(cardTitle);

  const textBody = document.createElement("p");
  textBody.classList.add("card-text");
  cardBody.appendChild(textBody);
  textBody.innerText = todoText;

  const doneButton = document.createElement("button");
  doneButton.classList.add("btn");
  doneButton.classList.add("btn-success");
  doneButton.innerText = "Done!";
  cardBody.appendChild(doneButton);
  doneButton.addEventListener("click", () => {
    cardRoot.style["background"] = "rgb(0, 195, 45)";
    cardRoot.style["color"] = "rgb(255, 255, 255)";
    const dataToSend = {
      id: cardRoot.id,
    };
    fetch("/markDone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn");
  deleteButton.classList.add("btn-danger");
  deleteButton.innerText = "Delete";
  // delete from db as well
  deleteButton.addEventListener("click", () => {
    deleteTodoElement(cardRoot.id);
    const dataToSend = {
      id: cardRoot.id,
    };
    fetch("/deleteFromDb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  });
  cardBody.appendChild(deleteButton);

  return cardRoot;
}

document.getElementById("todoForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(document.getElementById("todoForm"));
  const data = Object.fromEntries(formData.entries());

  fetch("/todoSubmit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const childToAppend = createTodoElement(data.title, data.todo);
      const dbId = childToAppend.id;
      const dataToSend = {
        id: dbId,
        todo: data.todo,
        title: data.title,
        status: "pending",
      };
      fetch("/addToDb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
      historyContainer.appendChild(childToAppend);
    });
});
