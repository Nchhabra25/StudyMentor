import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"
import quizService from "../../../services/quizService"
import PageHeader from "../../components/common/Pageheader"
import Spinner from "../../components/common/Spinner"
import Button from "../../components/common/Button"
import toast from "react-hot-toast"

const QuizTakePage = () => {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)

  /* ---------- FETCH ---------- */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(quizId)
        setQuiz(res.data)
      } catch {
        toast.error("Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner />
      </div>
    )
  }

  if (!quiz || !quiz.questions?.length) {
    return (
      <div className="text-center py-20 text-slate-600">
        Quiz not found
      </div>
    )
  }

  const question = quiz.questions[currentIndex]
  const answeredCount = Object.keys(answers).length

  /* ---------- HANDLERS ---------- */
 const selectOption = (index) => {
  setAnswers(prev => ({
    ...prev,
    [question._id]: question.options[index]
  }))
}


  const next = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((p) => p + 1)
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1)
    }
  }

const handleSubmitQuiz = async () => {
  setSubmitting(true);

  try {
    const payload = Object.entries(answers).map(
      ([questionId, selectedAnswer]) => ({
        questionIndex: quiz.questions.findIndex(
          q => q._id === questionId
        ),
        selectedAnswer
      })
    );

    await quizService.submitQuiz(quiz._id, payload);

    toast.success("Quiz submitted!");
    navigate(`/quizzes/${quiz._id}/results`);
  } catch (err) {
    toast.error(err?.error || "Submission failed");
  } finally {
    setSubmitting(false);
  }
};


  /* ---------- UI ---------- */
  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHeader title={quiz.title || "Take Quiz"} />

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
          <span>
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>

        <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-emerald-500 transition-all"
            style={{
              width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white border rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const selected = answers[question._id] === opt

            return (
              <label
                key={idx}
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition ${
                  selected
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={selected}
                  onChange={() => selectOption(idx)}
                />

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-slate-300"
                  }`}
                >
                  {selected && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                <span className="flex-1 text-slate-800">{opt}</span>

                {selected && (
                  <CheckCircle2 className="text-emerald-500" />
                )}
              </label>
            )
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center gap-3">
        <Button
          variant="ghost"
          onClick={prev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft /> Previous
        </Button>

        {currentIndex === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmitQuiz} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Quiz"}
          </Button>
        ) : (
          <Button onClick={next}>
            Next <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  )
}

export default QuizTakePage
