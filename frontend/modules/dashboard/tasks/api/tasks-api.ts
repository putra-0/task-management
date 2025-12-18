import api from "@/lib/http";
import { TableParams, TableResponseApi } from "@/types/api-types";
import { Task } from "../data/type";

export interface CreateTaskPayload {
  title: string;
  description: string;
  status: string;
  deadline: string;
}

export const tasksService = {
  fetchTasks: async (params: TableParams) => {
    const { data } = await api.get<TableResponseApi<Task>>("/tasks", { params });
    return data;
  },
  addTask: async (data: CreateTaskPayload) => {
    return await api.post("/tasks", data);
  },
};
