import "./Filter.css";

function Filter({ filter, setFilter, tasks }) {
  const total = tasks.length;

  const active = tasks.filter(
    (task) => !task.completed
  ).length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div className="filter-container">

      <button
        className={`filter-button ${
          filter === "all" ? "active" : ""
        }`}
        onClick={() => setFilter("all")}
      >
        All <span>{total}</span>
      </button>

      <button
        className={`filter-button ${
          filter === "active" ? "active" : ""
        }`}
        onClick={() => setFilter("active")}
      >
        Active <span>{active}</span>
      </button>

      <button
        className={`filter-button ${
          filter === "completed" ? "active" : ""
        }`}
        onClick={() => setFilter("completed")}
      >
        Completed <span>{completed}</span>
      </button>

    </div>
  );
}

export default Filter;