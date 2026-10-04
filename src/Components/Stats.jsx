import "./Stats.css";

function Stats({ tasks }) {
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const remainingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <div className="stats-container">

      <div className="stat-card">
        <div className="stat-top">
          <span>Total Tasks</span>
          <span className="stat-icon">◉</span>
        </div>

        <h2>{totalTasks}</h2>

        <p>Tasks created</p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Completed</span>
          <span className="stat-icon">✓</span>
        </div>

        <h2>{completedTasks}</h2>

        <p>Tasks completed</p>
      </div>

      <div className="stat-card">
        <div className="stat-top">
          <span>Remaining</span>
          <span className="stat-icon">○</span>
        </div>

        <h2>{remainingTasks}</h2>

        <p>Tasks to finish</p>
      </div>

    </div>
  );
}

export default Stats;