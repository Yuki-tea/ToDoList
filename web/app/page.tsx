import Image from "next/image";
import { createTask } from "./actions";

// 1. タスクの型定義（APIが返すデータの形）
type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
};

// 2. データを取得する関数 (Server Side)
async function getTasks(): Promise<Task[]> {
  // ★重要: Dockerコンテナ間の通信なので 'localhost' ではなく
  // docker-compose.yml で付けたサービス名 'api' を使います。
  const res = await fetch('http://api:3000/task', {
    cache: 'no-store', // 常に最新データを取る設定
  });

  if (!res.ok) {
    // APIがまだエラーを返している場合などのハンドリング
    console.error('Failed to fetch tasks');
    return [];
  }

  return res.json();
}

// 3. メインのコンポーネント
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
                <span>{task.title}</span>
                <span className="text-sm text-gray-400">
                  {task.isCompleted ? "完了" : "未完了"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
