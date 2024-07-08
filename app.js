let todos = [];

function showSection(section) {
    document.getElementById('choose').classList.add('hidden');
    document.getElementById('do').classList.add('hidden');
    document.getElementById('break').classList.add('hidden');
    document.getElementById(section).classList.remove('hidden');
    if (section === 'do') {
        updateDoSection();
    }
}

function addTodo() {
    const newTodo = document.getElementById('new-todo').value;
    if (newTodo) {
        todos.push({ text: newTodo, done: false });
        document.getElementById('new-todo').value = '';
        renderTodoList();
    }
}

function renderTodoList() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.onchange = () => toggleTodoDone(index);

        const text = document.createElement('span');
        text.textContent = todo.text;

        todoItem.appendChild(checkbox);
        todoItem.appendChild(text);
        todoList.appendChild(todoItem);
    });
}

function toggleTodoDone(index) {
    todos[index].done = !todos[index].done;
    renderTodoList();
}

function updateDoSection() {
    const currentTodo = document.getElementById('current-todo');
    currentTodo.innerHTML = '';

    const todo = todos.find(todo => !todo.done);
    if (todo) {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.onchange = () => toggleTodoDone(todos.indexOf(todo));

        const text = document.createElement('span');
        text.textContent = todo.text;

        todoItem.appendChild(checkbox);
        todoItem.appendChild(text);
        currentTodo.appendChild(todoItem);
    } else {
        currentTodo.textContent = 'No TODOs left!';
    }
}

function deferNext() {
    const todo = todos.shift();
    if (todo) {
        todos.splice(1, 0, todo);
        updateDoSection();
        renderTodoList();
    }
}

function deferLast() {
    const todo = todos.shift();
    if (todo) {
        todos.push(todo);
        updateDoSection();
        renderTodoList();
    }
}

function randomTodo() {
    const incompleteTodos = todos.filter(todo => !todo.done);
    if (incompleteTodos.length > 0) {
        const randomIndex = Math.floor(Math.random() * incompleteTodos.length);
        const randomTodo = incompleteTodos[randomIndex];
        todos = todos.filter(todo => todo !== randomTodo);
        todos.unshift(randomTodo);
        updateDoSection();
        renderTodoList();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTodoList();
});
