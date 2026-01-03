import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Trash2,
  Plus
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import flashcardService from '../../../services/flashcardService'
import aiService from '../../../services/aiService'
import Flashcard from '../../components/flashcards/Flashcard'
import PageHeader from '../../components/common/Pageheader'

const FlashcardPage = () => {
  const { id: documentId } = useParams()

  const [flashcardSets, setFlashcardSets] = useState([])
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchFlashcards = async () => {
    setLoading(true)
    try {
      const response = await flashcardService.getFlashcardsForDocument(documentId)
      setFlashcardSets(response.data[0])
      setFlashcards(response.data[0]?.cards || [])
    } catch {
      toast.error('Failed to fetch flashcards.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlashcards()
  }, [documentId])

  const handleGenerateFlashcards = async () => {
    setGenerating(true)
    try {
      await aiService.generateFlashcards(documentId)
      toast.success('Flashcards generated!')
      fetchFlashcards()
    } catch (error) {
      toast.error(error.message || 'Generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteFlashcardSet = async () => {
    setDeleting(true)
    try {
      await flashcardService.deleteFlashcardSet(flashcardSets._id)
      toast.success('Flashcard set deleted')
      setIsDeleteModalOpen(false)
      fetchFlashcards()
    } finally {
      setDeleting(false)
    }
  }

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleStar(cardId)
      setFlashcards(cards =>
        cards.map(c =>
          c._id === cardId ? { ...c, isStarred: !c.isStarred } : c
        )
      )
    } catch {
      toast.error('Failed to update star')
    }
  }

  const handleReview = async () => {
    const card = flashcards[currentCardIndex]
    if (!card) return
    try {
      await flashcardService.reviewFlashcard(card._id)
    } catch {

    }
  }

  const handleNext = () => {
    handleReview()
    setCurrentCardIndex(i => (i + 1) % flashcards.length)
  }

  const handlePrev = () => {
    handleReview()
    setCurrentCardIndex(i => (i - 1 + flashcards.length) % flashcards.length)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-32">
          <Spinner />
        </div>
      )
    }

    if (flashcards.length === 0) {
      return (
        <div className="py-24">
          <EmptyState
            title="No Flashcards Yet"
            description="Generate flashcards from your document to begin studying."
          />
        </div>
      )
    }

    const currentCard = flashcards[currentCardIndex]

    return (
      <div className="mt-10 flex flex-col items-center gap-8">
        {/* Flashcard */}
        <div className="w-full max-w-xl px-4">
          <Flashcard
            card={currentCard}
            onToggleStar={handleToggleStar}
          />
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={flashcards.length <= 1}
          >
            <ChevronLeft size={16} />
          </Button>

          <span className="text-sm font-medium text-slate-600">
            {currentCardIndex + 1} / {flashcards.length}
          </span>

          <Button
            variant="secondary"
            onClick={handleNext}
            disabled={flashcards.length <= 1}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24">
      {/* Back */}
      <div className="mb-6">
        <Link
          to={`/documents/${documentId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Document
        </Link>
      </div>

      {/* Header */}
      <PageHeader title="Flashcards">
        {!loading && (
          flashcards.length > 0 ? (
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={deleting}
            >
              <Trash2 size={16} />
              Delete Set
            </Button>
          ) : (
            <Button onClick={handleGenerateFlashcards} disabled={generating}>
              {generating ? <Spinner /> : <><Plus size={16} /> Generate</>}
            </Button>
          )
        )}
      </PageHeader>

      {renderContent()}

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set"
      >
        <p className="text-slate-600">
          This will permanently delete all flashcards for this document.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteFlashcardSet} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default FlashcardPage
