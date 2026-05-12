"use client";

import { useOptimistic, useState } from "react";
import { Task, Tag } from "@/lib/api";
import { TaskCreateForm } from "./TaskCreateForm";
import { TaskList } from "./TaskList";
import { TagCreateForm } from "./TagCreateForm";
import { TagContext } from "./TagContext";
import { createTask, State } from "../actions";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

type Props = {
  initialTasks: Task[];
  initialTags: Tag[];
};

export function TaskManager({ initialTasks, initialTags }: Props) {
  const [localTasks, setLocalTasks] = useState<Task[]>(initialTasks);

  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    localTasks,
    (state, newTask: { title: string; dueDate: string | null }) => [
      ...state,
      {
        id: Math.random(),
        title: newTask.title,
        isCompleted: false,
        dueDate: newTask.dueDate,
      },
    ],
  );

  // TaskCreateFormに渡す
  async function handleCreateTask(prevState: State, formData: FormData) {
    const title = formData.get("title") as string;
    const dueDate = formData.get("dueDate") as string;

    // 1. サーバーに送る前に、見た目を先に更新！
    if (title.trim()) {
      addOptimisticTask({
        title: title,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
    }

    // 2. サーバーで実行
    return await createTask(prevState, formData);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // useStateが自動でprevTasksに現状のlocalTasksを渡してくれる
      setLocalTasks((prevTasks) => {
        const oldIndex = prevTasks.findIndex((item) => item.id === active.id);
        const newIndex = prevTasks.findIndex((item) => item.id === over.id);
        return arrayMove(prevTasks, oldIndex, newIndex);
      });
      // ここにサーバーへ新しい順番を保存するAPI呼び出しを書く
    }
  };

  return (
    <div className="w-full max-w-md">
      <TaskCreateForm action={handleCreateTask} />
      {/* バケツリレー無しでタグの情報を子コンポーネントに渡せる */}
      <TagContext.Provider value={initialTags}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <TaskList tasks={optimisticTasks} />
        </DndContext>
      </TagContext.Provider>
      <TagCreateForm tags={initialTags} />
    </div>
  );
}
