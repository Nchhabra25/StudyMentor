import React, {useState,useEffect} from 'react'
import {useParams,Link} from 'react-router-dom'
import documentService from '../../../services/documentService'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'
import {ArrowLeft,ExternalLink} from 'lucide-react';
import PageHeader from '../../components/common/Pageheader'
import Tabs from '../../components/common/Tabs'
import ChatInterface from '../../components/chat/ChatInterface'
import AiActions from '../../components/ai/AiActions'
import FlashcardManager from '../../components/flashcards/FlashcardManager'
import QuizManager from '../../components/quizzes/QuizManager'

const DocumentDetails = () => {
const {id}=useParams()
const[document,setDocument]=useState(null)
const[loading,setLoading]=useState(true)
const[activeTab,setActiveTab]=useState('Content');

useEffect(() => {
  const fetchDocumentDetails = async () => {
    try {
      const data = await documentService.getDocumentById(id);
      setDocument(data);
    } catch (error) {
      toast.error('Failed to fetch document details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchDocumentDetails();
}, [id]);

// Helper function to get the full PDF URL
const getPdfUrl = () => {
  return document?.data?.fileUrl || null;
};


const renderContent = () => {
  if (loading) {
    return <Spinner />
  }

  if (!document?.data?.fileUrl) {
  return <div className="p-4 text-sm text-neutral-500">PDF not available</div>
}


  const pdfUrl = getPdfUrl()

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <span className="text-sm font-medium text-gray-700">
          Document Viewer
        </span>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
        >
          <ExternalLink size={16} />
          Open in new tab
        </a>
      </div>

      <iframe
        src={pdfUrl}
        className="w-full h-[70vh] bg-white"
        title="PDF Viewer"
      />
    </div>
  )
}


const renderChat = () => {
  return <ChatInterface documentId={id}/>
};

const renderAIActions = () => {
  return <AiActions/>
};

const renderFlashcardsTab = () => {
  return <FlashcardManager documentId={id}/>
};

const renderQuizzesTab = () => {
  return <QuizManager documentId={id}/>
};

const tabs = [
  { name: 'Content', label: 'Content', content: renderContent() },
  { name: 'Chat', label: 'Chat', content: renderChat() },
  { name: 'AI Actions', label: 'AI Actions', content: renderAIActions() },
  { name: 'Flashcards', label: 'Flashcards', content: renderFlashcardsTab() },
  { name: 'Quizzes', label: 'Quizzes', content: renderQuizzesTab() },
];

if (loading) {
  return <Spinner />;
}

if(!document){
  return <div className='text-center p-8'>Document Not Found</div>
}



  return (
    <div>
      <div className='mb-4'>
        <Link to='/documents' className='inline-flex gap-2 items-center text-sm text-neutral-600 hover:text-neutral-900 transition-colors'>
          <ArrowLeft size={16}/> Back to Documents
        </Link>
      </div>
      <PageHeader title={document.data.title}/>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab}/>
    </div>
  )
}

export default DocumentDetails