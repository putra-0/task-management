import api from "@/lib/http";
import { TableParams, TableResponseApi } from "@/types/api-types";
import { Task } from "../data/type";

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: string;
  deadline: string;
}

export interface UpdateTaskPayload {
  status: string;
}

export const tasksService = {
  fetchTasks: async (params: TableParams) => {
    const { data } = await api.get<TableResponseApi<Task>>("/tasks", {
      params,
    });
    return data;
  },
  addTask: async (data: CreateTaskPayload) => {
    return await api.post("/tasks", data);
  },
  updateTask: async (uuid: string, data: UpdateTaskPayload) => {
    return await api.put(`/tasks/${uuid}`, data);
  },
  deleteTask: async (uuid: string) => {
    return await api.delete(`/tasks/${uuid}`);
  },
};
