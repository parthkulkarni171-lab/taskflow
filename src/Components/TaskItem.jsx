import './TaskItem.css'
function TaskItem(props) {
  return (
    <div className="task-item">
      <input type="checkbox" />
      <div className="task-content">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
      <button className="task-menu">⋮</button>
    </div>
  );
}
export default TaskItem