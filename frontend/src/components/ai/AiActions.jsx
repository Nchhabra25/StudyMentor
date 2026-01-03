import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { BookOpen, Sparkles, Lightbulb } from 'lucide-react'
import aiService from '../../../services/aiService'
import toast from 'react-hot-toast'
import MarkdownRenderer from '../common/MarkdownRenderer'
import Modal from '../common/Modal'

const AiActions = () => {
  const { id: documentId } = useParams()

  const [loadingAction, setLoadingAction] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [concept, setConcept] = useState('')

  const handleGenerateSummary = async () => {
    setLoadingAction('summary')
    try {
      const { summary } = await aiService.generateSummary(documentId)
      setModalTitle('Generated Summary')
      setModalContent(summary)
      setIsModalOpen(true)
    } catch {
      toast.error('Failed to generate summary.')
    } finally {
      setLoadingAction(null)
    }
  }

  const handleExplainConcept = async (e) => {
    e.preventDefault()

    if (!concept.trim()) {
      toast.error('Please enter a concept to explain.')
      return
    }

    setLoadingAction('explain')
    try {
      const { explanation } = await aiService.explainConcept(documentId, concept)
      setModalTitle(`Explanation: ${concept}`)
      setModalContent(explanation)
      setIsModalOpen(true)
      setConcept('')
    } catch {
      toast.error('Failed to explain concept.')
    } finally {
      setLoadingAction(null)
    }
  }

  return (
    <div className="space-y-6 my-2">
      {/* Header */}
      <div className='bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-md shadow-sky-200/50 p-8 my-2 '>
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            AI Assistant
          </h3>
          <p className="text-sm text-slate-500">
            Smart actions powered by AI
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Summary Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-md shadow-sky-200/50 p-8 my-2">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-900">
                Generate Summary
              </h4>
            </div>
            <p className="text-sm text-slate-500">
              Get a concise AI-generated summary of the entire document.
            </p>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={loadingAction === 'summary'}
            className="group inline-flex items-center gap-2 px-2 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 mt-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 max-w-2/6 text-center"
          >
            {loadingAction === 'summary' ? 'Generating…' : 'Summarize'}
          </button>
        </div>

        {/* Explain Concept Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-md shadow-sky-200/50 p-8 my-2 ">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-slate-900">
                Explain a Concept
              </h4>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              Ask AI to explain any concept from this document.
            </p>

            <form onSubmit={handleExplainConcept} className="flex gap-3">
              <input
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g. Gradient Descent"
                className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-sm"
              />
              <button
                type="submit"
                disabled={loadingAction === 'explain'}
                className="group inline-flex items-center gap-2 px-3 h-10 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loadingAction === 'explain' ? 'Explaining…' : 'Explain'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal */}
     <Modal
        isOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        title={modalTitle}
    >
        <div className='max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate'>
            <MarkdownRenderer content={modalContent}/>
        </div>
    </Modal>
    </div>
  )
}

export default AiActions
