document.addEventListener("DOMContentLoaded", loadTasks);

let editMode = false;
let editId = null;

function addOrUpdateTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  let tasks = getTasksFromStorage();

  if (editMode) {
    // Update existing task
    tasks = tasks.map(task => {
      if (task.id === editId) {
        return { ...task, text: taskText };
      }
      return task;
    });
    editMode = false;
    editId = null;
    document.getElementById("addBtn").innerText = "Add Task";
  } else {
    // Add new task
    const task = {
      id: Date.now(),
      text: taskText,
      completed: false
    };
    tasks.push(task);
  }

  saveTasksToStorage(tasks);
  renderTasks();
  taskInput.value = "";
}

function editTask(id) {
  const tasks = getTasksFromStorage();
  const task = tasks.find(t => t.id === id);
  if (task) {
    document.getElementById("taskInput").value = task.text;
    editMode = true;
    editId = id;
    document.getElementById("addBtn").innerText = "Update Task";
  }
}

function deleteTask(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter(task => task.id !== id);
  saveTasksToStorage(tasks);
  renderTasks();
}

function completeTask(id) {
  let tasks = getTasksFromStorage();
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasksToStorage(tasks);
  renderTasks();
}

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const tasks = getTasksFromStorage();
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <div class="task-text">
        ${task.completed ? "✅" : ""} ${task.text}
      </div>
      <div class="task-buttons">
        <button class="complete-btn" onclick="completeTask(${task.id})">
          ${task.completed ? "Undo" : "Complete"}
        </button>
        <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

function loadTasks() {
  renderTasks();
}
