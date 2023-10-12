const listContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const deleteListBtn = document.querySelector("[data-delete-list]");

const listDisplayContainer = document.querySelector(
  "[data-list-display-container]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const taskContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const closeSidebar = document.querySelector("[data-close-sidebar]");
const overlay = document.querySelector("[data-overlay]");
const rightSidebar = document.querySelector("[data-right-sidebar]");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId =
  localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) || null;

listContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() == "li") {
    selectedListId = e.target.dataset.listId;
  } else if (e.target.parentElement.tagName.toLowerCase() == "li") {
    selectedListId = e.target.parentElement.dataset.listId;
  }
  saveAndRender();
});

taskContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() == "input") {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    saveAndRender();
  }
});

deleteListBtn.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);

  selectedListId = null;
  saveAndRender();
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName.trim() == "") return;
  const list = createList(listName);
  newListInput.value = "";
  lists.push(list);
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName.trim() == "") return;
  const task = createTask(taskName);
  newTaskInput.value = "";
  const selectedList = lists.find((list) => list.id == selectedListId);
  selectedList.tasks.push(task);
  saveAndRender();
});

function createTask(name) {
  const newTask = {
    id: Date.now().toString(),
    name,
    completed: false,
  };
  return newTask;
}

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
  renderLists();
  const selectedList = lists.find((list) => list.id == selectedListId);
  if (selectedListId === "null" || selectedListId == null) {
    listDisplayContainer.style.display = "none";
  } else {
    listDisplayContainer.style.display = "";
    listTitleElement.innerText = selectedList.name;
    clearElement(taskContainer);
    renderTasks(selectedList.tasks);
  }
}
function renderTasks(tasks) {
  tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("label");
    label.htmlFor = task.id;
    label.append(task.name);
    const button = taskElement.querySelector("button");
    button.dataset.openSidebar = task.id;
    taskContainer.appendChild(taskElement);
  });
}

function renderLists() {
  lists.forEach((list) => {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item");
    if (selectedListId === list.id) listItem.classList.add("active-list");
    listItem.dataset.listId = list.id;
    listItem.innerHTML = `<i class="bi bi-list-task"></i><p>${list.name}</p>`;
    listContainer.appendChild(listItem);
  });
}

function deleteTask(selectedTask) {
  const parent = selectedTask.closest("[data-task-id]");
  const { taskId } = parent.dataset;
  const selectedList = lists.find((list) => list.id == selectedListId);
  selectedList.tasks = selectedList.tasks.filter((task) => task.id != taskId);
  closeSideBar();
  saveAndRender();
}

function openSideBar(selectedTask) {
  overlay.style.display = "block";
  rightSidebar.classList.remove("hide");
  rightSidebar.dataset.taskId = selectedTask.dataset.openSidebar;
}

function closeSideBar() {
  overlay.style.display = "none";
  rightSidebar.classList.add("hide");
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
