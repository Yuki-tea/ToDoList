import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Next Todo
          </Link>
          <nav>
            <ul className="flex gap-6 text-sm font-medium text-gray-600">
              <li>
                <Link href="/inbox" className="hover:text-blue-600 transition-colors">
                  Inbox
                </Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-blue-600 transition-colors">
                  Plan
                </Link>
              </li>
              <li>
                <Link href="/focus" className="hover:text-blue-600 transition-colors">
                  Focus
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                  Dashboard
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
