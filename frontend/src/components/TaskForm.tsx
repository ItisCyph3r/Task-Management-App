import { useState, type FormEvent } from "react";
import { useCreateTask } from "../hooks/useTasks";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: createTask, isPending, isError, error } = useCreateTask();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    createTask(
      { title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
        },
      }
    );
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>New Task</h2>
      {isError && (
        <p className="error-text">
          {(error as Error)?.message ?? "Failed to create task"}
        </p>
      )}
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          disabled={isPending}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
          disabled={isPending}
        />
      </div>
      <button type="submit" disabled={isPending || !title.trim()}>
        {isPending ? "Creating…" : "Add Task"}
      </button>
    </form>
  );
}
