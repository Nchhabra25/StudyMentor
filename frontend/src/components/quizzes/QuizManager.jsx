import { useEffect, useState } from "react"
import { Plus, Play, BarChart2, Trash2,HelpCircle,Clock,CheckCircle2} from "lucide-react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import quizService from "../../../services/quizService"
import aiService from "../../../services/aiService"
import Spinner from "../common/Spinner"
import Modal from "../common/Modal"
import Button from "../common/Button"
import EmptyState from "../common/EmptyState"
import moment from "moment"

const QuizManager = ({ documentId }) => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [numQuestions, setNumQuestions] = useState(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [deleting, setDeleting] = useState(false)

  /* ---------------- FETCH ---------------- */
  const fetchQuizzes = async () => {
    if (!documentId) return
    setLoading(true)
    try {
      const res = await quizService.getQuizzesForDocument(documentId)
      setQuizzes(res.data)
    } catch {
      toast.error("Failed to fetch quizzes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [documentId])

  /* ---------------- GENERATE ---------------- */
  const handleGenerateQuiz = async (e) => {
    e.preventDefault()
    setGenerating(true)
    try {
      await aiService.generateQuiz(documentId, { numQuestions })
      toast.success("Quiz generated successfully")
      setIsGenerateModalOpen(false)
      fetchQuizzes()
    } catch (err) {
      toast.error(err.message || "Failed to generate quiz")
    } finally {
      setGenerating(false)
    }
  }

  /* ---------------- DELETE ---------------- */
  const handleDeleteRequest = (quiz) => {
    setSelectedQuiz(quiz)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedQuiz) return
    setDeleting(true)
    try {
      await quizService.deleteQuiz(selectedQuiz._id)
      toast.success("Quiz deleted")
      setIsDeleteModalOpen(false)
      fetchQuizzes()
    } catch {
      toast.error("Failed to delete quiz")
    } finally {
      setDeleting(false)
    }
  }

  /* ---------------- RENDER ---------------- */
  const renderContent = () => {
    if (loading) return <Spinner />

    if (!quizzes.length) {
      return (
        <EmptyState
          title="No quizzes yet"
          description="Generate a quiz from your document to test your knowledge"
        />
      )
    }

return (
  <div className="flex flex-wrap gap-5">
    {quizzes.map((quiz) => {
      const questionCount = quiz.questions?.length || 0
      const isCompleted = quiz.userAnswers?.length > 0

      return (
        <div
          key={quiz._id}
          className="group w-full bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-sky-200/40 transition-all duration-300 p-6"
        >
          {/* Top Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                {quiz.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <HelpCircle size={14} />
                  {questionCount}{" "}
                  {questionCount === 1 ? "Question" : "Questions"}
                </span>

                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {moment(quiz.createdAt).fromNow()}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleDeleteRequest(quiz)}
              className="md:opacity-0 md:group-hover:opacity-100 transition text-slate-400 hover:text-red-500"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Status */}
          <div className="mt-4">
            {isCompleted ? (
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 size={14} />
                Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                <Clock size={14} />
                Not Attempted
              </span>
            )}
          </div>

          {/* Action */}
          <div className="mt-6">
            {isCompleted ? (
              <Link to={`/quizzes/${quiz._id}/results`}>
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <BarChart2 size={16} />
                  View Results
                </Button>
              </Link>
            ) : (
              <Link to={`/quizzes/${quiz._id}`}>
                <Button className="w-full flex items-center justify-center gap-2">
                  <Play size={16} />
                  Start Quiz
                </Button>
              </Link>
            )}
          </div>
        </div>
      )
    })}
  </div>
)
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <Plus size={16} />
          Generate Quiz
        </Button>
      </div>

      {renderContent()}

      {/* Generate Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generate Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          <label className="text-sm font-medium">Number of questions</label>
          <input
            type="number"
            min={1}
            max={20}
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={generating}>
              {generating ? "Generating…" : "Generate"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Quiz?"
      >
        <p className="text-sm text-neutral-600 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default QuizManager
