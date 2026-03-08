import Image from "next/image";
import { Task, Tag, getTasks, getTags } from "@/lib/api";
import { TaskCreateForm } from "./_components/TaskCreateForm";
import { TaskManager } from "./_components/TaskManager";

// メインのコンポーネント
export default async function Home() {
  // サーバー側でデータを取得
  const tasks: Task[] = await getTasks();
  const tags: Tag[] = await getTags();

  return (
    <div className="flex min-h-screen flex-col items-center py-12 px-4 bg-white text-black">
      <h1 className="text-4xl font-bold mb-8">Todo List</h1>
      {/* タスク一覧表示エリア */}
      <TaskManager initialTasks={tasks} initialTags={tags} />
    </div>
  );
}
