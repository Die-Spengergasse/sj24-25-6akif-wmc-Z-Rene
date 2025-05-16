import { axiosInstance, createErrorResponse, ErrorResponse } from "@/utils/apiClient";
import { TodoItem } from "@/types/TodoItem";

export async function getTodoItems(): Promise<TodoItem[] | ErrorResponse> {
  try {
    const response = await axiosInstance.get<TodoItem[]>("api/TodoItems");
    return response.data;
  } catch (e) {
    return createErrorResponse(e);
  }
}
