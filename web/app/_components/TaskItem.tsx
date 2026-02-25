"use client";

// useActionStateはform用でuseTransitionはそれ以外用らしい
import { useOptimistic, useTransition, useState } from "react";
import { deleteTask, toggleTask, toggleTaskTag } from "../actions";
import { Task, Tag } from "@/lib/api";

type Props = {
  task: Task;
  allTags: Tag[];
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

export function TaskItem({ task, allTags }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
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

  const handleToggleTag = (tagId: number, isAttached: boolean) => {
    startTransition(async () => {
      await toggleTaskTag(task.id, tagId, isAttached);
    });
  };

  if (isDeletedOptimistic) {
    // この呼び出し時には描画無し
    return null;
  }

  const formattedDate = formatDueDate(task.dueDate);
  const overdue = !optimisticIsCompleted && isOverdue(task.dueDate);

  const attachedTagIds = task.tags?.map((t) => t.id) || [];

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

            {/* タグ追加ドロップダウン */}
            {allTags.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors border border-transparent hover:border-gray-300 flex items-center gap-1"
                >
                  ＋ タグ{isOpen ? "▲" : "▼"}
                </button>
                {/* ドロップダウンの中身 */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl p-2 z-20 w-48 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <p className="text-xs text-gray-500 mb-2 font-bold border-b pb-1 px-1">
                      タグを選択
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {allTags.map((tag) => {
                        const isAttached = attachedTagIds.includes(tag.id);
                        return (
                          <label
                            key={tag.id}
                            className={`flex items-center gap-2 text-sm p-1.5 cursor-pointer rounded transition-colors ${
                              isAttached ? "bg-green-50" : "hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isAttached}
                              onChange={() =>
                                handleToggleTag(tag.id, isAttached)
                              }
                              disabled={isPending} // 通信中は連打できないようにする
                              className="accent-green-600 w-4 h-4 cursor-pointer"
                            />
                            <span
                              className={
                                isAttached
                                  ? "font-bold text-green-700"
                                  : "text-gray-700"
                              }
                            >
                              {tag.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
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
