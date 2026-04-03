export type TaskStatus = "todo" | "in-progress" | "done";

export interface ITask {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: string;
}

export interface ITaskPage {
  data: ITask[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextPage: number | null;
}

export interface ICreateTaskDto {
  title: string;
  description?: string;
}

export interface IUpdateTaskDto {
  status: TaskStatus;
}
