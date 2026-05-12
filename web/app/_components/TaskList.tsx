"use client";

import { Task } from "@/lib/api";
import { TaskItem } from "./TaskItem";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type Props = {
  tasks: Task[];
};

export function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return <p className="text-gray-500 text-center">タスクはまだありません</p>;
  }

  const taskIds = tasks.map((task) => task.id);

  return (
    <ul className="space-y-4">
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </SortableContext>
    </ul>
  );
}
