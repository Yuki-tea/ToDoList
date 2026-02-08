import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold text-blue-600">
            Next Todo
          </h1>
          <nav>
            <ul className="flex gap-6 text-sm font-medium text-gray-600">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  ホーム
                </Link>
              </li>
              {/* 今後ページが増えたらここに追加 */}
              <li>
                <Link
                  href="#"
                  className="hover:text-blue-600 transition-colors opacity-50 cursor-not-allowed"
                >
                  統計
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* ユーザーアイコンなどのプレースホルダー */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
            User
          </div>
        </div>
      </div>
    </header>
  );
}
