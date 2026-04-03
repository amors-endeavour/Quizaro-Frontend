"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import API from "@/app/lib/api";

interface Option {
  text: string;
}

interface Question {
  _id: string;
  questionText: string;
  options: Option[];
  correctOption: number;
  explanation?: string;
}

interface Test {
  _id: string;
  title: string;
}

export default function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctOption: 0,
    explanation: "",
  });

  const fetchData = async () => {
    try {
      const [testRes, questionsRes] = await Promise.all([
        API.get(`/test/${id}`),
        API.get(`/admin/questions/${id}`),
      ]);
      setTest(testRes.data);
      setQuestions(questionsRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const questionData = {
      questionText: formData.questionText,
      options: formData.options.map((text, i) => ({ text, optionIndex: i })),
      correctOption: formData.correctOption,
      explanation: formData.explanation,
    };

    try {
      if (editingQuestion) {
        await API.put(`/admin/question/${editingQuestion._id}`, questionData);
      } else {
        await API.post(`/question/add/${id}`, questionData);
      }
      setShowModal(false);
      setEditingQuestion(null);
      resetForm();
      fetchData();
    } catch (err) {
      alert("Failed to save question");
    }
  };

  const resetForm = () => {
    setFormData({
      questionText: "",
      options: ["", "", "", ""],
      correctOption: 0,
      explanation: "",
    });
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      questionText: question.questionText,
      options: question.options.map((o) => o.text),
      correctOption: question.correctOption,
      explanation: question.explanation || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm("Delete this question?")) return;
    try {
      await API.delete(`/admin/question/${questionId}`);
      fetchData();
    } catch {
      alert("Failed to delete question");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/admin-dashboard/tests")}
            className="text-sm text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-1"
          >
            &larr; Back to Tests
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{test?.title || "Questions"}</h1>
          <p className="text-gray-500 mt-1">{questions.length} questions</p>
        </div>
        <button
          onClick={() => {
            setEditingQuestion(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + Add Question
        </button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center text-gray-400">
            <p className="text-4xl mb-4">❓</p>
            <p>No questions added yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first question
            </button>
          </div>
        ) : (
          questions.map((question, index) => (
            <div key={question._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">{question.questionText}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 ml-10">
                    {question.options.map((option, i) => (
                      <div
                        key={i}
                        className={`px-4 py-2 rounded-lg border ${
                          i === question.correctOption
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-700"
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                        {option.text}
                        {i === question.correctOption && <span className="ml-2">✓</span>}
                      </div>
                    ))}
                  </div>
                  {question.explanation && (
                    <div className="mt-3 ml-10 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Explanation:</span> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(question)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(question._id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {formData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[i] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={formData.correctOption === i}
                        onChange={() => setFormData({ ...formData, correctOption: i })}
                        className="w-4 h-4 text-green-600"
                      />
                      <span className="text-green-600 font-medium">Correct</span>
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Explanation (Optional)</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                  placeholder="Explain the correct answer..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingQuestion(null);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  {editingQuestion ? "Update Question" : "Add Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
