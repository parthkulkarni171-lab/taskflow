import { useEffect, useState } from "react";
import "./App.css"
import Navbar from "./Components/Navbar";
import Header from "./Components/Header";
import Stats from "./Components/Stats";
import TaskForm from "./Components/TaskForm";
import Filter from "./Components/Filter";
import TaskList from "./Components/TaskList";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import AdminDashboard from "./Components/AdminDashboard";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const isAdmin =  user?.email === "parthkulkarni171@gmail.com";
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // ====================
  // EDIT TASK STATES
  // ====================

  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // ====================
  // ADD TASK
  // ====================

  const addTask = async (text, description) => {
    const token = localStorage.getItem("token");

    const response = await fetch("https://taskflow-uyil.onrender.com/api/tasks", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title: text,
        description: description,
        priority: "medium",
      }),
    });

    const data = await response.json();

    console.log("Add task response:", data);

    if (!response.ok) {
      console.log(data.message);
      return;
    }

    setTasks([...tasks, data.task]);
  };

  // ====================
  // DELETE TASK
  // ====================

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`https://taskflow-uyil.onrender.com/api/tasks/${id}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("Delete task response:", data);

    if (!response.ok) {
      console.log(data.message);
      return;
    }

    setTasks(tasks.filter((task) => task.id !== id));
  };

  // ====================
  // COMPLETE / UNCOMPLETE TASK
  // ====================

  const completeTask = async (id, completed) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`https://taskflow-uyil.onrender.com/api/tasks/${id}`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        completed: completed,
      }),
    });

    const data = await response.json();

    console.log("Update task response:", data);

    if (!response.ok) {
      console.log(data.message);
      return;
    }

    setTasks(tasks.map((task) => (task.id === id ? data.task : task)));
  };

  // ====================
  // SELECT TASK TO EDIT
  // ====================

  const editTask = (task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  // ====================
  // UPDATE TASK
  // ====================

  const updateTask = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `https://taskflow-uyil.onrender.com/api/tasks/${editingTask.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          priority: editingTask.priority || "medium",
        }),
      },
    );

    const data = await response.json();

    console.log("Update task response:", data);

    if (!response.ok) {
      console.log(data.message);
      return;
    }

    setTasks(
      tasks.map((task) => (task.id === editingTask.id ? data.task : task)),
    );

    setEditingTask(null);
  };

  // ====================
  // GET TASKS
  // ====================
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const token = localStorage.getItem("token");

    const getUser = async () => {
      const response = await fetch("https://taskflow-uyil.onrender.com/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Logged-in user:", data);

      if (response.ok) {
        setUser(data);
      }
    };

    const getTasks = async () => {
      const response = await fetch("https://taskflow-uyil.onrender.com/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Tasks from backend:", data);

      if (response.ok) {
        setTasks(data);
      }
    };

    getUser();
    getTasks();
  }, [isLoggedIn]);

  // ====================
  // LOGIN
  // ====================
  if (!isLoggedIn) {
    if (isSignup) {
      return <Signup onSignup={() => setIsSignup(false)} />;
    }

    return (
      <Login
        onLogin={() => setIsLoggedIn(true)}
        onSignup={() => setIsSignup(true)}
      />
    );
  }
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });
  // ====================
  // TASKFLOW UI
  // ====================

if (isAdmin) {
  return (
    <AdminDashboard
      onLogout={() => {
        localStorage.removeItem("token");
        setUser(null);
        setIsLoggedIn(false);
      }}
    />
  );
}
  return (
    <>
      <Navbar
        user={user}
        onLogout={() => {
          localStorage.removeItem("token");
          setUser(null);
          setIsLoggedIn(false);
        }}
      />

      <Header />

      <Stats tasks={tasks} />

      {/* ====================
          EDIT FORM
      ==================== */}
      {editingTask && (
  <div className="edit-overlay">

    <div className="edit-modal">

      <div className="edit-modal-header">
        <div>
          <p>Edit task</p>
          <h2>Update your task</h2>
        </div>

        <button
          className="close-edit"
          onClick={() => setEditingTask(null)}
        >
          ×
        </button>
      </div>

      <div className="edit-form">

        <label>Task title</label>

        <input
          type="text"
          value={editTitle}
          onChange={(e) =>
            setEditTitle(e.target.value)
          }
        />

        <label>Description</label>

        <textarea
          value={editDescription}
          onChange={(e) =>
            setEditDescription(e.target.value)
          }
        />

      </div>

      <div className="edit-actions">

        <button
          className="cancel-edit"
          onClick={() => setEditingTask(null)}
        >
          Cancel
        </button>

        <button
          className="save-edit"
          onClick={updateTask}
        >
          Save Changes
        </button>

      </div>

    </div>

  </div>
)}

      <TaskForm onAddTask={addTask} />

      <Filter filter={filter} setFilter={setFilter} tasks={tasks} />

      <TaskList
        tasks={filteredTasks}
        onDeleteTask={deleteTask}
        onCompleteTask={completeTask}
        onEditTask={editTask}
      />
    </>
  );
}

export default App;
