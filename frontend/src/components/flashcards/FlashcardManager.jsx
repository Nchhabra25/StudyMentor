import React, { useState, useEffect } from 'react'
import moment from 'moment'
import toast from 'react-hot-toast'
import {
  Plus,
  Trash2,
  Sparkles,
  Brain,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'

import flashcardService from '../../../services/flashcardService'
import aiService from '../../../services/aiService'
import Spinner from '../common/Spinner'
import Modal from '../common/Modal'
import Flashcard from './Flashcard'

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([])
  const [selectedSet, setSelectedSet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [setToDelete, setSetToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  /* ---------------- FETCH ---------------- */
  const fetchFlashcardSets = async () => {
    setLoading(true)
    try {
      const res = await flashcardService.getFlashcardsForDocument(documentId)
      setFlashcardSets(res.data)
    } catch {
      toast.error('Failed to fetch flashcards')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (documentId) fetchFlashcardSets()
  }, [documentId])

  /* ---------------- GENERATE ---------------- */
  const handleGenerateFlashcards = async () => {
    setGenerating(true)
    try {
      await aiService.generateFlashcards(documentId)
      toast.success('Flashcards generated')
      fetchFlashcardSets()
    } catch (e) {
      toast.error(e.message || 'Failed to generate flashcards')
    } finally {
      setGenerating(false)
    }
  }

  /* ---------------- VIEWER ---------------- */
  const handleNext = () => {
    setCurrentCardIndex((i) => (i + 1) % selectedSet.cards.length)
  }

  const handlePrev = () => {
    setCurrentCardIndex(
      (i) => (i - 1 + selectedSet.cards.length) % selectedSet.cards.length
    )
  }

  /* ---------------- DELETE ---------------- */
  const handleDeleteRequest = (e, set) => {
    e.stopPropagation()
    setSetToDelete(set)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!setToDelete) return
    setDeleting(true)
    try {
      await flashcardService.deleteSet(setToDelete._id)
      toast.success('Flashcard set deleted')
      setIsDeleteModalOpen(false)
      setSelectedSet(null)
      fetchFlashcardSets()
    } catch {
      toast.error('Failed to delete set')
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleStar = async (cardId) => {
  try {
    await flashcardService.toggleStar(cardId);
    
    const updatedSets = flashcardSets.map((set) => {
      if (set._id === selectedSet._id) {
        const updatedCards = set.cards.map((card) =>
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        );
        return { ...set, cards: updatedCards };
      }
      return set;
    });

    setFlashcardSets(updatedSets);
    setSelectedSet(updatedSets.find((set) => set._id === selectedSet._id));
    toast.success("Flashcard starred status updated!");
  } catch (error) {
    toast.error("Failed to update star status.");
  }
};

  /* ---------------- VIEWER UI ---------------- */
  const renderFlashcardViewer = () => {
    const card = selectedSet.cards[currentCardIndex]

    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedSet(null)}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sets
        </button>

        <Flashcard card={card} onToggleStar={handleToggleStar} />

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
          >
            <ChevronLeft />
          </button>

          <span className="text-sm text-slate-500">
            {currentCardIndex + 1} / {selectedSet.cards.length}
          </span>

          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    )
  }

  /* ---------------- LIST UI ---------------- */
  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )
    }

    if (!flashcardSets.length) {
      return (
        <div className="text-center py-20 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Brain className="w-8 h-8 text-emerald-600" />
          </div>

          <h3 className="text-xl font-semibold text-slate-900">
            No Flashcards Yet
          </h3>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="inline-flex items-center gap-2 px-6 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Generating…' : 'Generate Flashcards'}
          </button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">
            Your Flashcard Sets
          </h3>

          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Generate New
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcardSets.map((set) => (
            <div
              key={set._id}
              onClick={() => setSelectedSet(set)}
              className="group relative bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer transition hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              {/* Delete */}
              <button
                onClick={(e) => handleDeleteRequest(e, set)}
                className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-emerald-600" />
                </div>

                <h4 className="font-semibold text-slate-900">
                  Flashcard Set
                </h4>

                <p className="text-sm text-slate-500">
                  {set.cards.length} cards •{' '}
                  {moment(set.createdAt).format('MMM DD, YYYY')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-lg p-6 sm:p-8">
      {selectedSet ? renderFlashcardViewer() : renderSetList()}

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-slate-600 mb-6">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 h-10 rounded-xl border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="px-4 h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default FlashcardManager
