import Image from "next/image";
import { getTasks } from "@/lib/api";
import { createTask, deleteTask, toggleTask } from "./actions";

// メインのコンポーネント
export default async function Home() {
  // サーバー側でデータを取得
  const tasks = await getTasks();

  return (
    <div className="flex min-h-screen flex-col items-center p-24 bg-white text-black">
      <h1 className="text-4xl font-bold mb-8">Todo List</h1>
      {/* create-task-form */}
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

      {/* タスク一覧表示エリア */}
      <div className="w-full max-w-md">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center">タスクはまだありません</p>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {/* 完了切り替えtoggle */}
                  <form action={toggleTask}>
                    <input type="hidden" name="id" value={task.id} />
                    <input type="hidden" name="isCompleted" value={task.isCompleted.toString()} />
                    <button
                      type="submit"
                      className={`w-6 h-6 rounded border flex items-center justify-center ${task.isCompleted ? "bg-green-500" : "bg-white border-gray-300"}`}
                    >
                      {task.isCompleted && <span className="text-white">✅</span>}
                    </button>
                  </form>

                  <span className={task.isCompleted ? "line-through text-gray-400" : ""}>
                    {task.title}
                  </span>
                  <span className={task.isCompleted ? "text-sm text-gray-400" : "text-sm text-red-400" }>
                    {task.isCompleted ? "完了" : "未完了"}
                  </span>
                </div>
                {/* 削除ボタン */}
                <form action={deleteTask}>
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
