let todos = [
    { text: 'Buy milk', done: false },
    { text: 'Feed the cat', done: false },
    { text: 'Do homework', done: false },
    { text: 'Call mom', done: false },
    { text: 'Read a book', done: false },
    { text: 'Go for a walk', done: false },
];
let history = [];
let redoHistory = [];
const MAX_HISTORY = 10;

function showSection(section) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(section).classList.remove('hidden');
    if (section === 'do') {
        updateDoSection();
    }
}

function addTodo() {
    const newTodo = document.getElementById('new-todo').value;
    if (newTodo) {
        recordHistory();
        todos.push({ text: newTodo, done: false });
        document.getElementById('new-todo').value = '';
        renderTodoList();
    }
}

function renderTodoList() {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    const sortedTodos = todos.slice().map((todo, index) => ({ ...todo, originalIndex: index }));
    sortedTodos.sort((a, b) => a.done - b.done);

    sortedTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.onchange = () => toggleTodoDone(todo.originalIndex);
        const checkboxId = `todo-${todo.originalIndex}`;
        checkbox.id = checkboxId;

        const label = document.createElement('label');
        label.textContent = todo.text;
        label.setAttribute('for', checkboxId);
        if (todo.done) label.classList.add('todo-done');

        todoItem.appendChild(checkbox);
        todoItem.appendChild(label);
        todoList.appendChild(todoItem);
    });
}

function toggleTodoDone(index) {
    recordHistory();
    todos[index].done = !todos[index].done;
    renderTodoList();
    updateDoSection();
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
        currentTodo.textContent = 'no todos left 😌';
    }
}

function deferNext() {
    recordHistory();
    const todo = todos.shift();
    if (todo) {
        todos.splice(1, 0, todo);
        updateDoSection();
    }
}

function deferLast() {
    recordHistory();
    const todo = todos.shift();
    if (todo) {
        todos.push(todo);
        updateDoSection();
    }
}

function randomTodo() {
    recordHistory();
    const incompleteTodos = todos.filter(todo => !todo.done);
    if (incompleteTodos.length > 0) {
        const randomIndex = Math.floor(Math.random() * incompleteTodos.length);
        const randomTodo = incompleteTodos[randomIndex];
        todos = todos.filter(todo => todo !== randomTodo);
        todos.unshift(randomTodo);
        updateDoSection();
    }
}

function recordHistory() {
    history.push(JSON.stringify(todos));
    if (history.length > MAX_HISTORY) {
        history.shift();
    }
    redoHistory = []; // Clear redo history whenever a new action is recorded
}

function undo() {
    if (history.length > 0) {
        redoHistory.push(JSON.stringify(todos));
        todos = JSON.parse(history.pop());
        renderTodoList();
        updateDoSection();
    }
}

function redo() {
    if (redoHistory.length > 0) {
        history.push(JSON.stringify(todos));
        todos = JSON.parse(redoHistory.pop());
        renderTodoList();
        updateDoSection();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderTodoList();
    document.addEventListener('keydown', (e) => {
        if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
            if (e.shiftKey) {
                e.preventDefault();
                redo();
            } else {
                e.preventDefault();
                undo();
            }
        }
    });
});

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = ''; // Legacy method for older browsers
});
