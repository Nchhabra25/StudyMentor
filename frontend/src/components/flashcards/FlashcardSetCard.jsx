import React from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, Sparkles, TrendingUp } from "lucide-react"
import moment from "moment"

const FlashcardSetCard = ({ flashcardSet }) => {
  const navigate = useNavigate()

  const handleStudyNow = () => {
    navigate(`/documents/${flashcardSet.documentId._id}/flashcards`)
  }

  const reviewedCount = flashcardSet.cards.filter(
    card => card.lastReviewed
  ).length

  const totalCards = flashcardSet.cards.length
  const progressPercentage =
    totalCards > 0
      ? Math.round((reviewedCount / totalCards) * 100)
      : 0

  return (
    <div
      onClick={handleStudyNow}
      className="group relative w-full cursor-pointer rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-sky-200/40 transition-all duration-300 p-6"
    >
      {/* Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-100/0 via-sky-100/0 to-sky-200/30 opacity-0 group-hover:opacity-100 transition pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center shadow-inner">
          <BookOpen className="text-sky-600" strokeWidth={2.2} />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-semibold text-slate-900 truncate"
            title={flashcardSet?.documentId?.title}
          >
            {flashcardSet?.documentId?.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Created {moment(flashcardSet.createdAt).fromNow()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mt-6 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">
          {totalCards} {totalCards === 1 ? "Card" : "Cards"}
        </span>

        {reviewedCount > 0 && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
            <TrendingUp size={14} />
            {progressPercentage}%
          </span>
        )}
      </div>

      {/* Progress */}
      {totalCards > 0 && (
        <div className="relative mt-4">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
            <span>Progress</span>
            <span>
              {reviewedCount}/{totalCards} reviewed
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Action */}
      <div className="relative mt-6">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleStudyNow()
          }}
          className="group inline-flex justify-center items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-300 to-teal-300 hover:from-emerald-600 hover:to-teal-600 hover:text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 w-full text-center cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2 text-center">
            <Sparkles size={16} />
            Study Now
          </span>

          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-emerald-500 opacity-0 group-hover/button:opacity-100 transition" />
        </button>
      </div>
    </div>
  )
}

export default FlashcardSetCard
