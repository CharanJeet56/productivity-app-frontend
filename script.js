document.addEventListener("DOMContentLoaded", () => {
  // DOM References
  const todoForm = document.getElementById("todoForm");
  const todoText = document.getElementById("todoText");
  const todoDue = document.getElementById("todoDue");
  const todoList = document.getElementById("todoList");

  const expenseForm = document.getElementById("expenseForm");
  const expenseDesc = document.getElementById("expenseDesc");
  const expenseAmount = document.getElementById("expenseAmount");
  const expenseCategory = document.getElementById("expenseCategory");
  const expenseDate = document.getElementById("expenseDate");
  const expenseList = document.getElementById("expenseList");
  const totalSpent = document.getElementById("totalSpent");

  const notifyForm = document.getElementById("notifyForm");
  const notifyTitle = document.getElementById("notifyTitle");
  const notifyTime = document.getElementById("notifyTime");
  const notificationList = document.getElementById("notificationList");

  // Use the current Replit URL
  const API_BASE_URL =
    "https://e1299a97-99ab-4d86-b24a-1c826cbd6d32-00-20afowxy2qpqx.pike.replit.dev";

  // --- To-Do Logic ---
  todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const task = todoText.value.trim();
    const due = todoDue.value;
    if (!task) return;

    try {
      const response = await fetch(
        `https://e1299a97-99ab-4d86-b24a-1c826cbd6d32-00-20afowxy2qpqx.pike.replit.dev/todos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task, dueDate: due }),
        },
      );
      if (response.ok) {
        fetchTodos();
        todoForm.reset();
      } else {
        alert("Failed to add to-do");
      }
    } catch (err) {
      console.error("Error adding to-do:", err);
      alert("Error adding to-do");
    }
  });

  async function fetchTodos() {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`);
      const todos = await response.json();
      renderTodos(todos);
    } catch (err) {
      console.error("Error fetching to-dos:", err);
    }
  }

  function renderTodos(todos) {
    todoList.innerHTML = "";
    todos.forEach((t) => {
      const li = document.createElement("li");
      li.innerHTML = `<span><strong>${t.task}</strong><br><small>Due: ${t.dueDate || "N/A"}</small></span>`;
      if (t.completed) li.style.textDecoration = "line-through";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteTodo(t.id);
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    });
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchTodos();
      else alert("Failed to delete to-do");
    } catch (err) {
      console.error("Error deleting to-do:", err);
    }
  }

  // Fetch to-dos on load
  fetchTodos();

  // --- Expense Tracker Logic ---
  expenseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const desc = expenseDesc.value.trim();
    const amount = parseFloat(expenseAmount.value);
    const category = expenseCategory.value.trim();
    const date = expenseDate.value;
    if (!desc || isNaN(amount) || !category || !date) return;

    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: desc, amount, category, date }),
      });
      if (response.ok) {
        fetchExpenses();
        expenseForm.reset();
      } else {
        alert("Failed to add expense");
      }
    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Error adding expense");
    }
  });

  async function fetchExpenses() {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses`);
      const expenses = await response.json();
      renderExpenses(expenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  }

  function renderExpenses(expenses) {
    expenseList.innerHTML = "";
    let total = 0;
    expenses.forEach((e) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>💸 <strong>${e.title}</strong> - ₹${e.amount.toFixed(2)}<br><small>${e.category} | ${e.date}</small></span>`;
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteExpense(e.id);
      li.appendChild(deleteBtn);
      expenseList.appendChild(li);
      total += e.amount;
    });
    totalSpent.textContent = total.toFixed(2);
  }

  async function deleteExpense(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchExpenses();
      else alert("Failed to delete expense");
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  }

  // Fetch expenses on load
  fetchExpenses();

  // --- Notification Logic ---
  async function fetchNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`);
      const data = await response.json();
      notificationList.innerHTML = `<li>${data.message}</li>`;
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }

  // Fetch notifications on load and every minute
  fetchNotifications();
  setInterval(fetchNotifications, 60000);

  notifyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = notifyTitle.value.trim();
    const time = new Date(notifyTime.value);
    if (!title || isNaN(time)) return;

    const now = new Date();
    const delay = time.getTime() - now.getTime();
    if (delay > 0) {
      setTimeout(() => {
        alert(`🔔 Reminder: ${title}`);
        fetchNotifications();
      }, delay);
    }

    notificationList.innerHTML += `<li>🔔 <strong>${title}</strong><br><small>${time.toLocaleString()}</small></li>`;
    notifyForm.reset();
  });
});
