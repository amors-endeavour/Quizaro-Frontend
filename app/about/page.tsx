import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Quizaro
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link href="/tests" className="text-gray-600 hover:text-blue-600 font-medium">
              Tests
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium">
              Contact
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Quizaro</h1>
        <p className="text-lg text-gray-600 mb-8">
          Quizaro is an online quiz platform designed to make learning engaging and accessible.
          Whether you are preparing for exams or just testing your knowledge, Quizaro provides
          a seamless experience with timed quizzes, instant grading, and competitive leaderboards.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">For Students</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Browse and purchase test series
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Take timed quizzes with instant results
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Track your progress and improvement
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Compete on leaderboards
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">For Educators</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Create and manage test series
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Add MCQ questions with explanations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Monitor student attempts and performance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Set pricing for premium content
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
