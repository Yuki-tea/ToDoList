import { createTask } from "../actions";

export function TaskCreateForm() {
  return (
    <form action={createTask} className="flex gap-2 mb-8 w-full max-w-md">
      <input
        type="text"
        name="title"
        placeholder="新しいタスクを入力..."
        className="border border-gray-300 p-2 rounded flex-grow text-black"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        追加
      </button>
    </form>
  );
}
