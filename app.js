let todos = [
    { text: '(1) Buy milk', done: false },
    { text: '(2) Buy eggs', done: false },
    { text: '(3) Buy bread', done: false },
    { text: '(4) Buy butter', done: false },
    { text: '(5) Buy cheese', done: false },
    { text: '(6) Buy jam', done: false },
    { text: '(7) Buy coffee', done: false },
];
let history = [];
let redoHistory = [];
const MAX_HISTORY = 10;

function addTodo() {
    const newTodo = document.getElementById('new-todo').value;
    if (newTodo) {
        recordHistory();
        todos.push({ text: newTodo, done: false });
        document.getElementById('new-todo').value = '';
        updateChooseSection();
    }
}

function updateChooseSection() {
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
    updateChooseSection();
    updateDoSection();
}

function updateDoSection() {
    const currentTodo = document.getElementById('current-todo');
    currentTodo.innerHTML = '';

    const todoIndex = todos.findIndex(todo => !todo.done);
    if (todoIndex !== -1) {
        const todo = todos[todoIndex];
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.onchange = () => toggleTodoDone(todoIndex);
        const checkboxId = `todo-${todoIndex}`;
        checkbox.id = checkboxId;

        const label = document.createElement('label');
        label.textContent = todo.text;
        label.setAttribute('for', checkboxId);

        todoItem.appendChild(checkbox);
        todoItem.appendChild(label);
        currentTodo.appendChild(todoItem);
    } else {
        currentTodo.textContent = 'no todos left 😌';
    }
    updateChooseSection()
}

function deferNext() {
    recordHistory();
    if (todos.shift()) {
        todos.splice(1, 0, todo);
        updateDoSection();
    }
}

function deferLast() {
    recordHistory();
    if (todos.shift()) {
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
        updateChooseSection();
        updateDoSection();
    }
}

function redo() {
    if (redoHistory.length > 0) {
        history.push(JSON.stringify(todos));
        todos = JSON.parse(redoHistory.pop());
        updateChooseSection();
        updateDoSection();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateChooseSection();
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
