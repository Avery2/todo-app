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

        // Add new todo to the end of the list
        todos.push({ text: newTodo, done: false });

        // Clear the input field and update the choose section
        document.getElementById('new-todo').value = '';
        updateChooseSection();
    }
}

function updateChooseSection() {
    // Clear the todo list
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';

    // Disable the clear-completed-button if there are no completed todos
    const clearCompletedButton = document.getElementById('clear-completed-button');
    if (todos.some(todo => todo.done)) {
        clearCompletedButton.removeAttribute('disabled');
    } else {
        clearCompletedButton.setAttribute('disabled', 'disabled');
    }

    // Sort finished todos to the bottom
    const sortedTodos = todos.slice().map((todo, index) => ({ ...todo, originalIndex: index }));
    sortedTodos.sort((a, b) => a.done - b.done);

    // Create todo items
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

    // Handle blank state
    if (todos.length === 0) {
        todoList.textContent = 'no todos yet 😌';
    }
}

function toggleTodoDone(index) {
    recordHistory();
    todos[index].done = !todos[index].done;
    updateDoSection();
}

function clearCompleted() {
    recordHistory();
    todos = todos.filter(todo => !todo.done);
    updateChooseSection();
    updateDoSection();
}

function updateDoSection(index = -1) {
    const currentTodo = document.getElementById('current-todo');
    currentTodo.innerHTML = '';

    if (index === -1) {
        index = todos.findIndex(todo => !todo.done);
    }

    if (index !== -1) {
        const todo = todos[index];
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.onchange = () => toggleTodoDone(index);
        const checkboxId = `todo-${index}`;
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
    todos.sort((a, b) => a.done - b.done);
    const nextIndex = todos.findIndex(todo => !todo.done);
    if (nextIndex !== -1) {
        const deferredTodo = todos.splice(nextIndex, 1)[0];
        todos.splice(nextIndex + 1, 0, deferredTodo);
        todos.sort((a, b) => a.done - b.done);
        updateDoSection();
    }
}

function deferLast() {
    recordHistory();
    todos.sort((a, b) => a.done - b.done);
    const todo = todos.shift()
    if (todo) {
        todos.push(todo);
        updateDoSection();
    }
}

function randomTodo() {
    recordHistory();

    // Get the index of some unfinished todo
    const unfinishedTodos = todos
        .map((todo, index) => ({ ...todo, originalIndex: index }))
        .filter(todo => !todo.done);
    const randomIndex = Math.floor(Math.random() * unfinishedTodos.length);
    const randomTodo = unfinishedTodos[randomIndex];

    updateDoSection(randomTodo.originalIndex);
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
