const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");

const lists = [];

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName == "") return;
  const list = createList(listName);
  newListInput.value = "";
  lists.push(list);
  render();
});

function createList(name) {
  const newList = {
    id: Date.now().toString(),
    name,
    tasks: [],
  };
  return newList;
}

function render() {
  clearElement(listContainer);
  lists.forEach((list) => {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item");
    listItem.dataset.listId = list.id;
    listItem.innerHTML = `<i class="bi bi-list-task"></i><p>${list.name}</p>`;
    listContainer.appendChild(listItem);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
