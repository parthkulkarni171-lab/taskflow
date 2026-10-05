import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard({onLogout}) {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getAdminData = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://taskflow-uyil.onrender.com/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setUsers(data.users);
      setTasks(data.tasks);
    };

    getAdminData();
  }, []);

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-page">

      <div className="admin-header">
        <div>
          <p className="admin-label">TASKFLOW ADMIN</p>
          <h1>Admin Dashboard</h1>
          <p>Monitor users and tasks across TaskFlow.</p>
        </div>
        <button className="admin-logout" onClick={onLogout}>
  Logout
</button>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Completed Tasks</span>
          <strong>
            {tasks.filter((task) => task.completed).length}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Active Tasks</span>
          <strong>
            {tasks.filter((task) => !task.completed).length}
          </strong>
        </div>
      </div>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <h2>Registered Users</h2>
            <p>Users who created an account on TaskFlow.</p>
          </div>

          <span className="count-badge">{users.length}</span>
        </div>

        <div className="users-table">
          <div className="table-header">
            <span>Name</span>
            <span>Email</span>
            <span>Joined</span>
          </div>

          {users.map((user) => (
            <div className="table-row" key={user.id}>
              <strong>{user.name}</strong>

              <span>{user.email}</span>

              <span>
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <div>
            <h2>All Tasks</h2>
            <p>Tasks created by TaskFlow users.</p>
          </div>

          <span className="count-badge">{tasks.length}</span>
        </div>

        <div className="tasks-grid">
          {tasks.map((task) => (
            <div className="admin-task-card" key={task.id}>

              <div className="task-card-top">
                <span
                  className={
                    task.completed
                      ? "status completed"
                      : "status active"
                  }
                >
                  {task.completed ? "Completed" : "Active"}
                </span>

                <span className="task-date">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3>{task.title}</h3>

              {task.description && (
                <p className="task-description">
                  {task.description}
                </p>
              )}

              <div className="created-by">
                <span>Created by</span>

                <strong>{task.name}</strong>

                <small>{task.email}</small>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default AdminDashboard;