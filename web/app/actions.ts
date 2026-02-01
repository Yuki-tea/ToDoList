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
