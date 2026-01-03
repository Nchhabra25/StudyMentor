import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Dashboard from './pages/dasboard/Dashboard'
import Profile from './pages/profile/ProfilePage'
import DocumentList from './pages/documents/DocumentList'
import DocumentDetails from './pages/documents/DocumentDetails'
import FlashcardList from './pages/flashcards/FlashcardList'
import FlashcardPage from './pages/flashcards/FlascardPage'
import QuizTakePage from './pages/quizzes/QuizTakePage'
import QuizResultPage from './pages/quizzes/QuizResultPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import NotFound from './pages/NotFound'
import { useAuth } from './context/AuthContext'
import HomePage from './pages/HomePage'


const App = () => {
  const {isAuthenticated,loading}=useAuth();
  
  if (loading) {
    return(
      <div className='flex items-center justify-center h-screen '>
        <p>Loading...</p>
      </div>
    ) 
  }
  return (
    <Router>
      <Routes>
  <Route
    path="/"
    element={
      isAuthenticated ? <Navigate to="/dashboard" replace /> : <HomePage />
    }
  />
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<Login />} />

  {/* Protected Routes */}
  <Route element={<ProtectedRoute />}>
  
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/documents" element={<DocumentList />} />
    <Route path="/documents/:id" element={<DocumentDetails />} />
    <Route path="/flashcards" element={<FlashcardList />} />
    <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
    <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
    <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>

    </Router>
  )
}

export default App