"use client";

import { useActionState, useRef } from "react";
import { State } from "../actions";

type Props = {
  action: (prevState: State, formData: FormData) => Promise<State>;
};

export function TaskCreateForm({ action }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  // state: サーバーから返ってきた最新の状態 { error: ... }
  // formAction: formのactionに渡す特別な関数
  // isPending: 通信中かどうかのフラグ
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });

  // 送信ハンドラ
  async function handleSubmit(formData: FormData) {
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    // TaskManagerからprops経由で渡されたhandleCreateTaskを実行
    // UI変更とPOSTリクエストを行う
    formAction(formData);

    // ✅ 送信成功後に入力欄をクリアする
    formRef.current?.reset();
  }

  return (
    <div className="mb-8 w-full max-w-md">
      <form
        ref={formRef}
        action={handleSubmit} // actionに直接関数を渡せる
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
        <div className="flex items-center gap-2 border border-gray-300 rounded px-3 bg-white disabled:bg-gray-100 focus-within:border-blue-500">
          <label
            htmlFor="dueDate"
            className="text-sm text-gray-500 whitespace-nowrap cursor-pointer"
          >
            📅 期限:
          </label>

          <input
            type="date"
            name="dueDate"
            className="border border-gray-300 p-2 rounded flex-grow text-black disabled:bg-gray-100"
            disabled={isPending}
          />
        </div>

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
      {state.error && (
        <p className="text-red-500 text-sm mt-2">{state.error}</p>
      )}
    </div>
  );
}
