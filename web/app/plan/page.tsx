import Link from 'next/link';

export default function PlanPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white min-h-[calc(100vh-64px)] p-6 text-center">
      <div className="w-64 h-64 mb-8 bg-black rounded-full flex items-center justify-center p-4">
        <img 
          src="https://api.iconify.design/fluent-emoji:dog-face.svg" 
          alt="Cute Dog" 
          className="w-48 h-48"
        />
      </div>
      <h1 className="text-3xl font-bold text-amber-600 mb-4">Plan</h1>
      <p className="text-gray-600 mb-8 text-lg italic">"I've planned everything... to be a good dog. Implementation coming soon!"</p>
      <Link href="/" className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
        Back to Home
      </Link>
    </div>
  );
}
