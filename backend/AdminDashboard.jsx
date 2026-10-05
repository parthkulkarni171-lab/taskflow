import { useEffect, useState } from "react";

function AdminDashboard() {
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
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>

      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}

      <h2>Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id}>
          <p>{task.title}</p>
          <p>Created by: {task.name}</p>
          <p>{task.email}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;