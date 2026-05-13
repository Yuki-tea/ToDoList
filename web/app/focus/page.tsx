import Link from 'next/link';

export default function FocusPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-[calc(100vh-64px)] p-6 text-center">
      <div className="w-64 h-64 mb-8 bg-black rounded-full flex items-center justify-center p-4">
        <img 
          src="https://api.iconify.design/fluent-emoji:owl.svg" 
          alt="Focused Owl" 
          className="w-48 h-48"
        />
      </div>
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">Focus</h1>
      <p className="text-gray-600 mb-8 text-lg italic">"Whooo is focusing? Not this page yet, but you should be!"</p>
      <Link href="/" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
        Back to Home
      </Link>
    </div>
  );
}
