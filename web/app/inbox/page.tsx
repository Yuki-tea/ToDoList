import Link from 'next/link';

export default function InboxPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-[calc(100vh-64px)] p-6 text-center">
      <div className="w-64 h-64 mb-8 bg-black rounded-full flex items-center justify-center p-4">
        <img 
          src="https://api.iconify.design/fluent-emoji:cat-face.svg" 
          alt="Cute Cat" 
          className="w-48 h-48 -mt-4"
        />
      </div>
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Inbox</h1>
      <p className="text-gray-600 mb-8 text-lg italic">"I'm sorting your ToDos... in my dreams. Not implemented yet!"</p>
      <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
        Back to Home
      </Link>
    </div>
  );
}
