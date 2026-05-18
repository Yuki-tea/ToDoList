"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  error: string | null;
};

const baseURL = process.env.API_INTERNAL_URL;

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
    await fetch(`${baseURL}/tasks`, {
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
    const res = await fetch(`${baseURL}/tasks/${id}`, {
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
    const res = await fetch(`${baseURL}/tasks/${id}`, {
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

export async function createTag(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;

  if (!name.trim()) {
    return { error: "タグを入力してください" };
  }

  try {
    const res = await fetch(`${baseURL}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      return { error: "タグの作成に失敗しました" };
    }

    revalidatePath("/");
    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: "サーバーでエラーが発生しました" };
  }
}
// FormDataを使わない直接呼び出し用のアクションなので、少し引数が違う
export async function toggleTaskTag(
  taskId: number,
  tagId: number,
  isCurrentlyAttached: boolean,
) {
  try {
    // 既に付いているならDELETE、付いていないならPOST
    const method = isCurrentlyAttached ? "DELETE" : "POST";
    await fetch(`${baseURL}/tasks/${taskId}/tags/${tagId}`, {
      method: method,
    });

    revalidatePath("/");
  } catch (error) {
    console.error(error);
    return { error: "サーバーでエラーが発生しました" };
  }
}

export async function reorderTasks(taskIds: number[]) {
  try {
    const res = await fetch(`${baseURL}/tasks/reorder`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskIds: taskIds,
      }),
    });

    if (!res.ok) {
      return { error: "並び替えに失敗しました" };
    }

    revalidatePath("/");
    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: "サーバーでエラーが発生しました" };
  }
}
