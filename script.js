const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

const lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

listContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() == "li") {
    selectedListId = e.target.dataset.listId;
  } else if (e.target.parentElement.tagName.toLowerCase() == "li") {
    selectedListId = e.target.parentElement.dataset.listId;
  }
  saveAndRender();
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName == "") return;
  const list = createList(listName);
  newListInput.value = "";
  lists.push(list);
  saveAndRender();
});

function createList(name) {
  const newList = {
    id: Date.now().toString(),
    name,
    tasks: [],
  };
  return newList;
}
function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}
function render() {
  clearElement(listContainer);
  lists.forEach((list) => {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item");
    if (selectedListId === list.id) listItem.classList.add("active-list");
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
