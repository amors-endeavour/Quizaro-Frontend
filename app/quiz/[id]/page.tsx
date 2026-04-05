"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizaro-backend-3fkj.onrender.com";

interface Option {
  _id?: string;
  text: string;
}

interface Question {
  _id: string;
  questionText: string;
  options: Option[];
}

interface Test {
  _id: string;
  title: string;
  duration: number;
}

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [testRes, questionsRes] = await Promise.all([
          fetch(`${API_URL}/test/${id}`, { credentials: "include" }),
          fetch(`${API_URL}/questions/${id}`, { credentials: "include" }),
        ]);

        if (!testRes.ok || !questionsRes.ok) {
          const errData = await testRes.json().catch(() => ({ message: "Failed to load quiz" }));
          throw new Error(errData.message || "Failed to load quiz");
        }

        const testData = await testRes.json();
        const questionsData = await questionsRes.json();

        setTest(testData);
        setQuestions(questionsData);
        setTimeLeft((testData.duration || 30) * 60);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const answersArray = questions.map((q) => ({
        questionId: q._id,
        selectedOption: answers[q._id] ?? -1,
      }));

      const res = await fetch(`${API_URL}/test/submit/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers: answersArray }),
      });

      if (res.ok) {
        const data = await res.json();
        const attemptId = data?.attemptId || data?.result?.attemptId || data?._id || "";
        router.push(`/result?attemptId=${attemptId}`);
      } else {
        const data = await res.json();
        alert(data.message || "Submission failed");
        setSubmitting(false);
      }
    } catch {
      alert("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md">
          <p className="text-4xl mb-4">⚠️</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Quiz</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/user-dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-semibold text-gray-900">{test?.title}</h1>
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-500">
              {answeredCount}/{questions.length} answered
            </div>
            <div className={`px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 300 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-700"}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-xl font-medium text-gray-900 mb-6">{question?.questionText}</h2>

          <div className="space-y-3">
            {question?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question._id, index)}
                className={`w-full p-4 rounded-lg border-2 text-left transition ${
                  answers[question._id] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-medium ${
                  answers[question._id] === index
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option.text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </button>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-lg font-medium text-sm flex items-center justify-center transition ${
                  index === currentQuestion
                    ? "bg-blue-600 text-white"
                    : answers[q._id] !== undefined
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100"></div>
              <span>Not Answered</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
