"use client";

import { useOptimistic } from "react";
import { deleteTask, toggleTask } from "../actions";
import { Task } from "@/lib/api";

type Props = {
  task: Task;
};

export function TaskItem({ task }: Props) {
  const [optimisticIsCompleted, switchOptimistic] = useOptimistic(
    task.isCompleted,
    // Reactの仕様で第一引数に現在の状態が渡される
    (currentState) => !currentState,
  );

  async function handleToggle(formData: FormData) {
    // 自動で現在の状態が渡されるので要らないが、引数無しだと起こられるからとりあえず埋めてる
    switchOptimistic(undefined);
    const result = await toggleTask(formData);
    if (result?.error) {
      alert(result.error);
    }
  }

  const [isDeletedOptimistic, setDeletedOptimistic] = useOptimistic(
    false,
    () => true,
  );

  async function handleDelete(formData: FormData) {
    // 削除フラグを立てる
    setDeletedOptimistic(undefined);
    const result = await deleteTask(formData);
    if (result?.error) {
      alert(result.error);
    }
  }

  if (isDeletedOptimistic) {
    // この呼び出し時には描画無し
    return null;
  }

  return (
    <li className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
      <div className="flex items-center gap-2">
        {/* 完了切り替えtoggle */}
        <form action={handleToggle}>
          <input type="hidden" name="id" value={task.id} />
          <input
            type="hidden"
            name="isCompleted"
            value={task.isCompleted.toString()}
          />
          <button
            type="submit"
            className={`w-6 h-6 rounded border flex items-center justify-center ${optimisticIsCompleted ? "bg-green-500" : "bg-white border-gray-300"}`}
          >
            {optimisticIsCompleted && <span className="text-white">✅</span>}
          </button>
        </form>

        <span
          className={optimisticIsCompleted ? "line-through text-gray-400" : ""}
        >
          {task.title}
        </span>
        <span
          className={
            optimisticIsCompleted
              ? "text-sm text-gray-400"
              : "text-sm text-red-400"
          }
        >
          {optimisticIsCompleted ? "完了" : "未完了"}
        </span>
      </div>
      {/* 削除ボタン */}
      <form action={handleDelete}>
        <input type="hidden" name="id" value={task.id} />
        <button
          type="submit"
          className="text-red-500 hover:text-red-700 p1"
          aria-label="削除"
        >
          🗑️
        </button>
      </form>
    </li>
  );
}
