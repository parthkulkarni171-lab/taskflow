import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onDeleteTask,
  onCompleteTask,
  onEditTask,
}) {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          title={task.title}
          description={task.description}
          completed={task.completed}
          onDeleteTask={onDeleteTask}
          onCompleteTask={onCompleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
}

export default TaskList;