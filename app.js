let todos = [];

function addTodo() {
    const todoInput = document.getElementById('new-todo');
    const todoText = todoInput.value.trim();
    if (todoText) {
        todos.push(todoText);
        todoInput.value = '';
        renderTodoList();
    }
}

function renderTodoList() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.textContent = todo;
        li.classList.add('todo-item');
        li.appendChild(createRemoveButton(index));
        todoList.appendChild(li);
    });
}

function createRemoveButton(index) {
    const button = document.createElement('button');
    button.textContent = 'Remove';
    button.onclick = () => removeTodo(index);
    return button;
}

function removeTodo(index) {
    todos.splice(index, 1);
    renderTodoList();
}

function chooseTodo() {
    if (todos.length > 0) {
        const chosenTodo = todos[0]; // Simple selection logic for now
        document.getElementById('chosen-todo').textContent = `Next TODO: ${chosenTodo}`;
    } else {
        document.getElementById('chosen-todo').textContent = 'No TODOs available';
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Initialize the app by showing the first section
document.addEventListener('DOMContentLoaded', () => {
    showSection('choose-section');
    renderTodoList();
});
