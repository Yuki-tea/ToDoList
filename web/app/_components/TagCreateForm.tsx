"use client";

import { useActionState, useRef } from "react";
import { createTag } from "../actions";

export function TagCreateForm() {
  const [state, formAction, isPending] = useActionState(createTag, { error: null });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    formAction(formData);
    formRef.current?.reset();
  };

  return (
    <div className="mb-6 w-full max-w-md p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-sm font-bold text-gray-700 mb-2">🏷️ タグの管理</h3>
      <form
        ref={formRef}
        action={handleSubmit}
        className="flex gap-2 w-full"
      >
        <input
          type="text"
          name="name"
          placeholder="新しいタグ名 (例: 仕事, 重要)..."
          className="border border-gray-300 p-2 rounded flex-grow text-black text-sm outline-none focus:border-green-500"
          required
          disabled={isPending}
        />

        <button
          type="submit"
          disabled={isPending}
          className={`text-white px-4 py-2 rounded transition-colors whitespace-nowrap ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isPending ? "作成中..." : "タグ作成"}
        </button>
      </form>
      {state?.error && (
        <p className="text-red-500 text-sm mt-2">{state.error}</p>
      )}
    </div>
  );
}
