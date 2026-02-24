"use client";

import { useOptimistic } from "react";
import { Task } from "@/lib/api";
import { TaskCreateForm } from "./TaskCreateForm";
import { TaskList } from "./TaskList";
import { createTask, State } from "../actions";

type Props = {
  initialTasks: Task[];
};

export function TaskManager({ initialTasks }: Props) {
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    initialTasks,
    (state, newTask: { title: string; dueDate: string | null }) => [
      ...state,
      {
        id: Math.random(),
        title: newTask.title,
        isCompleted: false,
        dueDate: newTask.dueDate,
      },
    ],
  );

  // TaskCreateFormに渡す
  async function handleCreateTask(prevState: State, formData: FormData) {
    const title = formData.get("title") as string;
    const dueDate = formData.get("dueDate") as string;

    // 1. サーバーに送る前に、見た目を先に更新！
    if (title.trim()) {
      addOptimisticTask({
        title: title,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
    }

    // 2. サーバーで実行
    return await createTask(prevState, formData);
  }

  return (
    <div className="w-full max-w-md">
      <TaskCreateForm action={handleCreateTask} />
      <TaskList tasks={optimisticTasks} />
    </div>
  );
}
