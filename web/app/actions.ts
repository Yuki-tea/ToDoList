"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  error: string | null;
};

export async function createTask(
  prevState: State,
  formData: FormData,
): Promise<State> {
  // formから入力値を取得
  const title = formData.get("title") as string;
  const dueDate = formData.get("dueDate") as string;

  // 空文字なら何もしない
  if (!title.trim()) {
    return { error: "タイトルを入力してください" };
  }

  try {
    // Dockerの内部通信だからapi:...
    await fetch("http://api:3000/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        isCompleted: false,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      }),
    });

    // トップページのキャッシュをクリアして、最新リストを再取得させる
    revalidatePath("/");

    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: "サーバーでエラーが発生しました" };
  }
}

export async function deleteTask(formData: FormData) {
  // idを取得
  const id = formData.get("id");

  try {
    // 削除用のAPIを叩く
    const res = await fetch(`http://api:3000/task/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete task");
    }
    revalidatePath("/");
    return { error: null };
  } catch (error) {
    console.error("deleteTask error:", error);
    return { error: "削除に失敗しました" };
  }
}

export async function toggleTask(formData: FormData) {
  // idを取得
  const id = formData.get("id");
  const isCompleted = formData.get("isCompleted") === "true";

  try {
    const res = await fetch(`http://api:3000/task/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isCompleted: !isCompleted,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to update task");
    }
    revalidatePath("/");
    return { error: null };
  } catch (error) {
    console.error("toggleTask error:", error);
    return { error: "更新に失敗しました" };
  }
}
