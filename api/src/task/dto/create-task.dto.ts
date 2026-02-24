// src/task/dto/create-task.dto.ts
export class CreateTaskDto {
  title: string;
  isCompleted?: boolean;
  // JSONで送られてくる時は文字列になるからstringも必要らしい
  dueDate?: Date | string;
}
