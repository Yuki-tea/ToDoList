import Image from "next/image";
import { getTasks } from "@/lib/api";
import { TaskCreateForm } from "./_components/TaskCreateForm";
import { TaskList } from "./_components/TaskList";

// メインのコンポーネント
export default async function Home() {
  // サーバー側でデータを取得
  const tasks = await getTasks();

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-white text-black">
      <h1 className="text-4xl font-bold mb-8">Todo List</h1>
      <TaskCreateForm />
      {/* タスク一覧表示エリア */}
      <div className="w-full max-w-md">
        <TaskList tasks={tasks} />
      </div>
    </main>
  );
}
