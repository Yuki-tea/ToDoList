"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTask(formData: FormData) {
  // formから入力値を取得
  const title = formData.get("title");

  // 空文字なら何もしない
  if(!title || title.toString().trim() === "") {
    return;
  }

  // Dockerの内部通信だからapi:...
  await fetch("http://api:3000/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      isCompleted: false,
    })
  });

  // トップページのキャッシュをクリアして、最新リストを再取得させる
  revalidatePath("/");
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
