import { Task } from "@/lib/api";
import { TaskItem } from "./TaskItem";

type Props = {
  tasks: Task[];
};

export function TaskList({ tasks }: Props) {
  if (tasks.length === 0) {
    return <p className="text-gray-500 text-center">タスクはまだありません</p>;
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
