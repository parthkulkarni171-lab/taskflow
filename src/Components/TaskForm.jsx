import { useState } from "react";
import "./TaskForm.css";

function TaskForm({ onAddTask }) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");

  const handleButtonClick = () => {
    if (text.trim() === "") {
      return;
    }

    onAddTask(text, description);

    setText("");
    setDescription("");
  };

  return (
    <section className="task-form-section">

      <div className="task-form-header">
        <div>
          <h2>My Tasks</h2>
          <p>Create a task and keep your work moving.</p>
        </div>
      </div>

      <div className="task-form">

        <div className="task-inputs">

          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
          />

        </div>

        <button
          className="add-task-button"
          onClick={handleButtonClick}
        >
          + Add Task
        </button>

      </div>

    </section>
  );
}

export default TaskForm;