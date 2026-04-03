import type { TaskStatus } from "../types";

interface Props {
  status: TaskStatus;
}

const labels: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export default function StatusBadge({ status }: Props) {
  return <span className={`badge badge--${status}`}>{labels[status]}</span>;
}
