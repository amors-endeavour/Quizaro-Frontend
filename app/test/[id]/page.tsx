"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const questions: Question[] = [
  {
    _id: "1",
    question: "2 + 2 = ?",
    options: ["2", "3", "4", "5"],
    correctAnswer: "4",
    explanation: "2 + 2 equals 4",
  },
  {
    _id: "2",
    question: "Capital of India?",
    options: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
    correctAnswer: "Delhi",
    explanation: "Delhi is capital of India",
  },
];

export default function TestPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);

  const currentQuestion = questions[current];

  const handleSelect = (option: string) => {
    setAnswers({
      ...answers,
      [currentQuestion._id]: option,
    });
  };

  const submitTest = () => {
    // Save result for demo (in real app send to backend)
    localStorage.setItem(
      "result",
      JSON.stringify({ answers, questions })
    );

    router.push("/result");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Test Series
        </h2>

        {/* Question */}
        <div>
          <p className="font-semibold text-lg mb-4">
            Q{current + 1}. {currentQuestion.question}
          </p>

          {currentQuestion.options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`p-3 mb-3 border rounded cursor-pointer transition
                ${
                  answers[currentQuestion._id] === option
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
            >
              {option}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent(current + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitTest}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Submit Test
            </button>
          )}
        </div>

        {/* Question Tracker */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-8 h-8 rounded text-sm ${
                current === index
                  ? "bg-blue-600 text-white"
                  : answers[questions[index]._id]
                  ? "bg-green-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}