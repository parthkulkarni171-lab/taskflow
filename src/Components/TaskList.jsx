import TaskItem from "./TaskItem";

function TaskList() {
  return (
    <div className="task-list">
      <TaskItem
        title="Learn React"
        description="Practice useState and components"
      />
      <TaskItem
        title="Build Task Manager"
        description="Create the first React project"
      />
      <TaskItem
        title="Learn API Integration"
        description="Practice fetching data"
      />
    </div>
  );
}
export default TaskList;
