import "./TaskForm.css";
function TaskForm() {
  return (
    <>
      <div className="title">
        <h1>My Tasks</h1>
      </div>
      <div className="container">
        <input type="text" placeholder="Enter your Task" />
        <button className="add">+ Add Task</button>
      </div>
    </>
  );
}
export default TaskForm;
