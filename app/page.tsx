import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Quizaro</h1>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-white hover:text-blue-200 font-medium">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">
          Test Your Knowledge
        </h2>
        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
          Take quizzes, track your progress, and compete on leaderboards.
          Quizaro makes learning engaging and fun.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg"
          >
            Get Started
          </Link>
          <Link
            href="/tests"
            className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 font-semibold text-lg"
          >
            Browse Tests
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white mb-2">Take Quizzes</h3>
            <p className="text-white/70">
              Attempt timed quizzes with instant grading and detailed explanations.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
            <p className="text-white/70">
              View your results, scores, and improvement over time.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-white mb-2">Leaderboards</h3>
            <p className="text-white/70">
              Compete with others and see where you rank.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
