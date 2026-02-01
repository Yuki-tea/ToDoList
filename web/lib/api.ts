// タスクの型定義(APIが返すデータの形)
type Task = {
  id: number;
  title: string;
  isCompleted: boolean;
};

// データを取得する関数 (Server Side)
export async function getTasks(): Promise<Task[]> {
  // 重要: Dockerコンテナ間の通信なので 'localhost' ではなく
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
