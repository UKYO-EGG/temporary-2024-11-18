const getTodos = () => {
  const storedTodos = localStorage.getItem('todos');
  return storedTodos ? JSON.parse(storedTodos) : [];
};

const setTodos = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const renderTodos = () => {
  const todos = getTodos();
  const uncompletedTodoList = document.getElementById('uncompleted-todo-list');
  const completedTodoList = document.getElementById('completed-todo-list');
  uncompletedTodoList.innerHTML = '';
  completedTodoList.innerHTML = '';

  todos.forEach(todo => {
    const todoCard = document.createElement('div');
    todoCard.className = `todo-card${todo.completed ? ' todo-completed' : ''}`;
    todoCard.dataset.id = todo.id;

    const todoText = document.createElement('div');
    todoText.className = 'todo-text';
    todoText.textContent = todo.text;
    todoText.contentEditable = true;
    todoText.addEventListener('blur', () => updateTodoText(todo.id, todoText.textContent));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'delete-btn';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodoCompletion(todo.id));

    todoCard.appendChild(checkbox);
    todoCard.appendChild(todoText);
    todoCard.appendChild(deleteButton);

    if (todo.completed) {
      completedTodoList.appendChild(todoCard);
    } else {
      uncompletedTodoList.appendChild(todoCard);
    }
  });
};

const addTodo = (text) => {
  const todos = getTodos();
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false
  };
  todos.push(newTodo);
  setTodos(todos);
  renderTodos();
};

const deleteTodo = (id) => {
  const todos = getTodos();
  const updatedTodos = todos.filter(todo => todo.id !== id);
  setTodos(updatedTodos);
  renderTodos();
};

const toggleTodoCompletion = (id) => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
    return todo;
  });
  setTodos(updatedTodos);
  renderTodos();
};

const updateTodoText = (id, newText) => {
  const todos = getTodos();
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.text = newText;
    setTodos(todos);
    renderTodos();
  }
};

const checkAllTodos = () => {
  const todos = getTodos();
  const allCompleted = todos.every(todo => todo.completed);
  const updatedTodos = todos.map(todo => {
    todo.completed = !allCompleted;
    return todo;
  });
  setTodos(updatedTodos);
  renderTodos();
};

document.getElementById('todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const todoInput = document.getElementById('todo-input');
  const text = todoInput.value.trim();
  if (text) {
    addTodo(text);
    todoInput.value = '';
  }
});

document.getElementById('check-all-btn').addEventListener('click', checkAllTodos);

renderTodos();
