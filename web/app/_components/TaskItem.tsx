"use client";

// useActionStateはform用でuseTransitionはそれ以外用らしい
import { useOptimistic } from "react";
import { deleteTask, toggleTask } from "../actions";
import { Task } from "@/lib/api";
import { TagPulldown } from "./TagPulldown";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  task: Task;
};

// MM/DD形式にフォーマットする関数
function formatDueDate(dateString?: string | null) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function isOverdue(dateString?: string | null) {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
}

export function TaskItem({ task }: Props) {
  // idを渡すことで並び替え可能になる
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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

  const formattedDate = formatDueDate(task.dueDate);
  const overdue = !optimisticIsCompleted && isOverdue(task.dueDate);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-center"
      suppressHydrationWarning // aria-* 属性などのランダムIDのズレを無視させる
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
          aria-label="タスクを並び替える"
          suppressHydrationWarning // aria-* 属性などのランダムIDのズレを無視させる
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
          </svg>
        </button>
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

        <div className="flex flex-col gap-1">
          {/* タスク名表示 */}
          <span
            className={
              optimisticIsCompleted ? "line-through text-gray-400" : ""
            }
          >
            {task.title}
          </span>

          {/*  タグ表示エリア */}
          <div className="flex flex-wrap items-center gap-1 relative">
            <TagPulldown taskId={task.id} attachedTags={task.tags} />
            {/* 紐づいているタグを表示 */}
            {task.tags?.map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200"
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* 期限の表示 */}
          <span
            className={`text-xs flex items-center gap-1 mt-1 
              ${overdue ? "text-red-500 font-bold" : "text-gray-500"}`}
          >
            📅 期限: {formattedDate ? formattedDate : "なし"}
            {overdue && " (期限切れ!)"}
          </span>
        </div>
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
