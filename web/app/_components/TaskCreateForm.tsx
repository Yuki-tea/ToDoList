"use client";

import { useState, useRef } from "react";
import { createTask } from "../actions";

type Props = {
  action: (formData: FormData) => Promise<void>;
};

export function TaskCreateForm({ action }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 送信ハンドラ
  async function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    setIsPending(true);
    setErrorMsg(null);

    try {
      // TaskManagerからprops経由で渡されたhandleCreateTaskを実行
      // UI変更とPOSTリクエストを行う
      await action(formData);

      // ✅ 送信成功後に入力欄をクリアする
      formRef.current?.reset();
    } catch (error) {
      console.error("Failed to create task:", error);
      setErrorMsg("タスクの追加に失敗しました。通信環境を確認してください。");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="mb-8 w-full max-w-md">
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
      {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
    </div>
  );
}
