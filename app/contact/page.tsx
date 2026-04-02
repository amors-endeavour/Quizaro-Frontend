import Link from "next/link";

export default function ContactPage() {
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
            <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium">
              About
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 mb-8">
          Have questions or feedback? We would love to hear from you.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">support@quizaro.com</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
              <p className="text-gray-600">Monday - Friday, 9:00 AM - 6:00 PM</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-600">We typically respond within 24 hours.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
