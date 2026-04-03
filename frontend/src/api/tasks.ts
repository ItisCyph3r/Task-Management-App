import axios from "axios";
import type { ITask, ITaskPage, ICreateTaskDto, IUpdateTaskDto } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

export async function getTasks(page = 1, limit = 10): Promise<ITaskPage> {
  const { data } = await api.get<ITaskPage>("/tasks", {
    params: { page, limit },
  });
  return data;
}

export async function createTask(payload: ICreateTaskDto): Promise<ITask> {
  const { data } = await api.post<ITask>("/tasks", payload);
  return data;
}

export async function updateTask(
  id: number,
  payload: IUpdateTaskDto
): Promise<ITask> {
  const { data } = await api.put<ITask>(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
