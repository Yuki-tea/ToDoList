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

  // 削除用のAPIを叩く
  await fetch(`http://api:3000/task/${id}`, {
    method: "DELETE",
  });

  revalidatePath("/");
}

export async function toggleTask(formData: FormData) {
  // idを取得
  const id = formData.get("id");
  const isCompleted = formData.get("isCompleted") === "true";

  await fetch(`http://api:3000/task/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isCompleted: !isCompleted,
    }),
  });

  revalidatePath("/");
}
