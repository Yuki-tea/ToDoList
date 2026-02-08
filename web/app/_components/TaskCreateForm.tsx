"use client";

import { useState, useRef } from "react";
import { createTask } from "../actions";

export function TaskCreateForm() {
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // 送信ハンドラ
  async function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    setIsPending(true);

    try {
      // Server Actionを直接呼び出す
      await createTask(formData);

      // ✅ 送信成功後に入力欄をクリアする
      formRef.current?.reset();
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("タスクの追加に失敗しました");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit} // actionに直接関数を渡せる（Next.jsの機能）
      className="flex gap-2 mb-8 w-full max-w-md"
    >
      <input
        type="text"
        name="title"
        placeholder="新しいタスクを入力..."
        className="border border-gray-300 p-2 rounded flex-grow text-black disabled:bg-gray-100"
        required
        disabled={isPending}
      />
      <button
        type="submit"
        disabled={isPending}
        className={`text-white px-4 py-2 rounded transition-colors ${
          isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isPending ? "追加中..." : "追加"}
      </button>
    </form>
  );
}
