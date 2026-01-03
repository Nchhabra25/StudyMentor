import { useState } from "react"
import { Star, RotateCcw } from "lucide-react"

const Flashcard = ({ card, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  return (
    <div
      className="w-full max-w-xl mx-auto"
     
    >
      <div
        onClick={handleFlip}
        className="relative h-100 sm:h-95 transition-transform duration-500 transform-gpu cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT — QUESTION */}
        <div
          className="absolute inset-0 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="space-y-4">
            <span className="inline-block text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
              Question
            </span>

            <p className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed">
              {card.question}
            </p>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-md">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Click to reveal answer</span>
            </div>
          </div>
        </div>

        {/* BACK — ANSWER */}
        <div
          className="absolute inset-0 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* STAR */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleStar(card._id)
            }}
            className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition ${
              card.isStarred
                ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-amber-500"
            }`}
          >
            <Star
              className="w-5 h-5"
              strokeWidth={2}
              fill={card.isStarred ? "currentColor" : "none"}
            />
          </button>

          <div className="space-y-4">
            <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
              Answer
            </span>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              {card.answer}
            </p>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <RotateCcw className="w-4 h-4" />
            <span>Click to go back</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
