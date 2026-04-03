import type { ITask, TaskStatus } from "../types";
import StatusBadge from "./StatusBadge";
import { useUpdateTask, useDeleteTask } from "../hooks/useTasks";

interface Props {
  task: ITask;
}

const STATUSES: TaskStatus[] = ["todo", "in-progress", "done"];

export default function TaskCard({ task }: Props) {
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  function handleStatusChange(status: TaskStatus) {
    if (status === task.status) return;
    updateTask({ id: task.id, payload: { status } });
  }

  function handleDelete() {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    deleteTask(task.id);
  }

  const busy = isUpdating || isDeleting;

  return (
    <div className={`task-card task-card--${task.status}`}>
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__footer">
        <select
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          disabled={busy}
          aria-label="Update status"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "todo" ? "To Do" : s === "in-progress" ? "In Progress" : "Done"}
            </option>
          ))}
        </select>

        <span className="task-card__date">
          {new Date(task.created_at).toLocaleDateString()}
        </span>

        <button
          className="btn-delete"
          onClick={handleDelete}
          disabled={busy}
          aria-label="Delete task"
        >
          {isDeleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}
