import React, { useState, useEffect, useRef } from 'react'
import MarkdownRenderer from '../common/MarkdownRenderer'
import { Send, MessageSquare, Sparkles } from 'lucide-react'
import { useParams } from 'react-router-dom'
import aiService from '../../../services/aiService'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../common/Spinner'

const ChatInterface = ({documentId}) => {
  const { user } = useAuth()

  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true)
        const response = await aiService.getChatHistory(documentId)
        setHistory(response.data || [])
        console.log(response.extractedText)
      } catch (error) {
        console.error('Failed to fetch chat history:', error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchChatHistory()
  }, [documentId])

  useEffect(() => {
    scrollToBottom()
  }, [history])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setHistory(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)

    try {
      const response = await aiService.chat(documentId, message)

      const assistantMessage = {
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
        relevantChunks: response.data.relevantChunks
      }

      setHistory(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I ran into an error. Please try again.',
          timestamp: new Date()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderMessage = (msg, index) => {
    const isUser = msg.role === 'user'

    return (
      <div
        key={index}
        className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}
      >
        {!isUser && (
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        )}

        <div
          className={`max-w-lg p-4 rounded-2xl shadow-sm ${
            isUser
              ? 'bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-tr-md'
              : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-slate">
              <MarkdownRenderer content={msg.content} />
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-semibold shrink-0">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
    )
  }

  if (initialLoading) {
    return (
      <div className="flex flex-col h-[70vh] bg-white border rounded-2xl items-center justify-center">
        <Spinner />
        <p className="text-sm text-slate-500 mt-3">Loading chat history...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white border rounded-2xl overflow-hidden">
      <div className="flex-1 p-6 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-10 h-10 text-emerald-500 mb-3" />
            <p className="text-sm text-slate-500">
              Ask me anything about the document
            </p>
          </div>
        ) : (
          history.map(renderMessage)
        )}

        <div ref={messagesEndRef} />

        {loading && (
          <div className="flex items-center gap-3 my-4">
            <Spinner />
            <span className="text-sm text-slate-500">Thinking...</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 h-12 px-4 border rounded-xl"
            placeholder="Ask a question..."
            disabled={loading}
          />
          <button
            disabled={loading || !message.trim()}
            className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface
