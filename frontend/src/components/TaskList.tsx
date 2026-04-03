import type { ITask } from "../types";
import TaskCard from "./TaskCard";

interface Props {
  tasks: ITask[];
}

export default function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="empty-state">No tasks yet. Create one above to get started.</p>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
