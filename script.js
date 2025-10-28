document.addEventListener('DOMContentLoaded', () => {

    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');

    const filterAllBtn = document.getElementById('filter-all');
    const filterPendingBtn = document.getElementById('filter-pending');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const filterButtons = document.querySelectorAll('.filter-controls button');

    const clearCompletedBtn = document.getElementById('clear-completed-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'pending') {
                return !task.completed;
            }
            if (currentFilter === 'completed') {
                return task.completed;
            }
            return true;
        });

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.dataset.id = task.id;
            if (task.completed) {
                li.classList.add('completed');
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const span = document.createElement('span');
            span.textContent = task.text;
            span.setAttribute('contenteditable', 'false');
            span.addEventListener('dblclick', () => editTaskText(span, task.id));
            span.addEventListener('blur', () => saveTaskText(span, task.id));
            span.addEventListener('keydown', (e) => {
                 if (e.key === 'Enter') {
                    e.preventDefault();
                    span.blur();
                 }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);

            taskList.appendChild(li);
        });

        updateCounter();
        updateFilterButtons();
    }

    function updateCounter() {
        const pendingTasksCount = tasks.filter(task => !task.completed).length;
        if (pendingTasksCount === 1) {
            taskCounter.textContent = 'Você tem 1 tarefa pendente.';
        } else {
            taskCounter.textContent = `Você tem ${pendingTasksCount} tarefas pendentes.`;
        }
    }

    function updateFilterButtons() {
        filterButtons.forEach(button => {
            if (button.id === `filter-${currentFilter}`) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    function addTask(e) {
        e.preventDefault();

        const text = taskInput.value.trim();

        if (text === '') {
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        renderTasks();
    }

    function toggleTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function editTaskText(span, id) {
        span.contentEditable = 'true';
        span.focus();
    }

    function saveTaskText(span, id) {
        span.contentEditable = 'false';
        const newText = span.textContent.trim();
        const task = tasks.find(task => task.id === id);

        if (task && newText !== '') {
            task.text = newText;
            saveTasks();
        } else if (newText === '') {
            span.textContent = task.text;
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function changeFilter(newFilter) {
        currentFilter = newFilter;
        renderTasks();
    }

    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }

    taskForm.addEventListener('submit', addTask);

    filterAllBtn.addEventListener('click', () => changeFilter('all'));
    filterPendingBtn.addEventListener('click', () => changeFilter('pending'));
    filterCompletedBtn.addEventListener('click', () => changeFilter('completed'));

    clearCompletedBtn.addEventListener('click', clearCompleted);

    renderTasks();
});