import React,{useState,useEffect} from 'react'
import Spinner from '../../components/common/Spinner';
import quizService from '../../../services/quizService';
import toast from 'react-hot-toast';
import { useParams,Link } from 'react-router-dom';
import { ArrowLeft,Trophy,Target,CheckCircle2,XCircle,BookOpen } from 'lucide-react';
import PageHeader from '../../components/common/Pageheader';

const QuizResultPage = () => {
const { quizId } = useParams();
const [results, setResults] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchResults = async () => {
    try {
      const data = await quizService.getQuizResults(quizId);
      setResults(data);
    } catch (error) {
      toast.error('Failed to fetch quiz results.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchResults();
}, [quizId]);

if(loading){
  return(
    <div className='flex justify-center items-center min-h-[60vh]'>
      <Spinner/>
    </div>
  )
}

if(!results||!results.data){
  return(
    <div className='flex justify-center items-center min-h-[60vh]'>
      <div className='text-center'>
        <p className='text-slate-600 text-lg'>Quiz results not found</p>
      </div>
    </div>
  )
}

// Destructuring data from the results state
const { data: { quiz, results: detailedResults } } = results;
const score = quiz.score;
const totalQuestions = detailedResults.length;
const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
const incorrectAnswers = totalQuestions - correctAnswers;

// Dynamic color scaling based on score
const getScoreColor = (score) => {
  if (score >= 80) return 'from-emerald-500 to-teal-500';
  if (score >= 60) return 'from-amber-500 to-orange-500';
  return 'from-rose-500 to-red-500';
};

// Performance feedback messages
const getScoreMessage = (score) => {
  if (score >= 90) return 'Outstanding! ';
  if (score >= 80) return 'Great job! ';
  if (score >= 70) return 'Good work! ';
  if (score >= 60) return 'Not Bad! ';
  return 'Keep Practicing'
};

  return (
    <div className='max-w-5xl mx-auto'>
      <div className="mb-6">
  <button className='group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-300 to-teal-300 hover:from-emerald-600 hover:to-teal-600 hover:text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'>
  <Link
    to={`/documents/${quiz.document._id}`}
    className="group inline-flex items-center gap-2 text-md   font-medium text-slate-600 hover:text-white/80 duration-200"
  >
    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2} />
    Back to Document
  </Link>
  </button>
</div>

<PageHeader title={`${quiz.title || 'Quiz'} Results`} />

{/* Score Card */}
<div className="bg-white/80 p-6 backdrop-blur-xl border-2 border-slate-200 rounded-2xlshadow-xl shadow-sky-400/60 mb-2">
  <div className="text-center space-y-6">
    <div className="inline-flex items-center justify-center w-15 h-15 rounded-2xl bg-linear-to-r from-emerald-100 to-teal-100 shadow-lg shadow-emerald-200/50">
      <Trophy className="w-7 h-7 text-emerald-700" strokeWidth={2} />
    </div>
 

<div>
  <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
    Your Score
  </p>
  <div className={`inline-block text-5xl font-bold bg-linear-to-r ${getScoreColor(score)} bg-clip-text text-transparent mb-2`}>
    {score}% 
  </div>
  <p className="text-lg font-medium text-slate-700">
    {getScoreMessage(score)}
  </p>
</div>
    </div>
    {/* Stats */}
<div className="flex items-center justify-center gap-4 pt-4 flex-col md:flex-row">
  {/* Total Questions */}
  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
    <Target className="w-4 h-4 text-slate-600" strokeWidth={2} />
    <span className="text-sm font-semibold text-slate-700">
      {totalQuestions} Total
    </span>
  </div>

  {/* Correct Answers */}
  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
    <CheckCircle2 className="w-4 h-4 text-emerald-600" strokeWidth={2} />
    <span className="text-sm font-semibold text-emerald-700">
      {correctAnswers} Correct
    </span>
  </div>

  {/* Incorrect Answers */}
  <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl">
    <XCircle className="w-4 h-4 text-rose-600" strokeWidth={2} />
    <span className="text-sm font-semibold text-rose-700">
      {incorrectAnswers} Incorrect
    </span>
  </div>
</div>
     </div>
  {detailedResults.map((result, index) => {
  const userAnswerIndex = result.options.findIndex(
    opt => opt === result.selectedAnswer
  )

  const correctAnswerIndex = result.correctAnswer.startsWith("O")
    ? parseInt(result.correctAnswer.substring(1)) - 1
    : result.options.findIndex(opt => opt === result.correctAnswer)

  const isCorrect = result.isCorrect

  return (
    <div
      key={index}
      className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 mb-6 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Question {index + 1}
          </span>
          <h4 className="mt-1 text-lg font-semibold text-slate-900">
            {result.question}
          </h4>
        </div>

        <div
          className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border-2 ${
            isCorrect
              ? "bg-emerald-50 border-emerald-200"
              : "bg-rose-50 border-rose-200"
          }`}
        >
          {isCorrect ? (
            <CheckCircle2
              className="text-emerald-600"
              strokeWidth={2.5}
            />
          ) : (
            <XCircle
              className="text-rose-600"
              strokeWidth={2.5}
            />
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {result.options.map((option, optIndex) => {
          const isCorrectOption = optIndex === correctAnswerIndex
          const isUserAnswer = optIndex === userAnswerIndex
          const isWrongAnswer = isUserAnswer && !isCorrect

          return (
            <div
              key={optIndex}
              className={`relative px-4 py-3 rounded-xl border-2 transition-all ${
                isCorrectOption
                  ? "bg-emerald-50 border-emerald-300 shadow-sm shadow-emerald-100"
                  : isWrongAnswer
                  ? "bg-rose-50 border-rose-300"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`text-sm font-medium ${
                    isCorrectOption
                      ? "text-emerald-900"
                      : isWrongAnswer
                      ? "text-rose-900"
                      : "text-slate-700"
                  }`}
                >
                  {option}
                </span>

                <div className="flex items-center gap-2">
                  {isCorrectOption && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                      <CheckCircle2 size={14} />
                      Correct
                    </span>
                  )}

                  {isWrongAnswer && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-100 px-2 py-1 rounded-full">
                      <XCircle size={14} />
                      Your Answer
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Explanation */}
      {result.explanation && (
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center">
              <BookOpen className="text-sky-600" strokeWidth={2} />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Explanation
              </p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})}

</div>
  )
}

export default QuizResultPage