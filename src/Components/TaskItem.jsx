import "./TaskItem.css";

function TaskItem({
  title,
  id,
  description,
  completed,
  onDeleteTask,
  onCompleteTask,
  onEditTask,
}) {
  return (
    <div className="task-item">

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) =>
          onCompleteTask(id, e.target.checked)
        }
      />

      {/* Task content */}
      <div className="task-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      {/* Edit button */}
      <button
        className="task-edit"
        onClick={() =>
          onEditTask({
            id: id,
            title: title,
            description: description,
            completed: completed,
          })
        }
      >
        Edit
      </button>

      {/* Delete button */}
      <button
        className="task-menu"
        onClick={() => onDeleteTask(id)}
      >
        Delete
      </button>

    </div>
  );
}

export default TaskItem;