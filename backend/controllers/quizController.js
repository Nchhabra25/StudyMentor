import Quiz from "../models/Quiz.js";


//@desc get all quizzes
//route GET /api/quizzes/:documentId
//@access Private
export const getQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      userId: req.user._id,
      documentId: req.params.documentId
    })
    .populate('documentId', 'title fileName')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

//@desc get a single quiz by Id
//route GET /api/quizzes/quiz/:id
//@access Private
export const getQuizById = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404
      });
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

//@desc submit a quiz
//route POST /api/quizzes/:id/submit
//@access Private
export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body;
        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: "Please provide answers array",
                statusCode: 400
            });
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!quiz) {
            return res.status(404).json({ // Changed to 404 Not Found
                success: false,
                error: "Quiz not found",
                statusCode: 404
            });
        }

        // This check now works correctly because completedAt starts as null
        if (quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: "Quiz already completed",
                statusCode: 400
            });
        }

        let correctCount = 0;
        const userAnswers = [];

        // Safety check: use the actual questions length if totalQuestions is somehow 0
        const total = quiz.totalQuestions || quiz.questions.length;

        answers.forEach(answer => {
            const { questionIndex, selectedAnswer } = answer;

            if (questionIndex >= 0 && questionIndex < quiz.questions.length) {
                const question = quiz.questions[questionIndex];
                const isCorrect = selectedAnswer === question.correctAnswer;

                if (isCorrect) correctCount++;

                userAnswers.push({
                    questionIndex,
                    selectedAnswer,
                    isCorrect,
                    answeredAt: new Date()
                });
            }
        });

        // Calculate score
        const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
        
        // Update quiz object
        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date(); // Now this marks it as finished

        await quiz.save();

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: total,
                percentage: score,
                userAnswers
            },
            message: "Quiz submitted successfully"
        });

    } catch (error) {
        next(error);
    }
};

//@desc get quiz results
//route GET /api/quiz/:id
//@access Private
export const getQuizResults=async(req,res,next)=>{
    try {
        const quiz = await Quiz.findOne({
        _id: req.params.id,
        userId: req.user._id
        }).populate('documentId', 'title');

        if (!quiz) {
        return res.status(404).json({
            success: false,
            error: 'Quiz not found',
            statusCode: 404
        });
        }

        if (!quiz.completedAt) {
        return res.status(400).json({
            success: false,
            error: 'Quiz not completed yet',
            statusCode: 400
        });
        }

        const detailedResults = quiz.questions.map((question, index) => {
        const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

        return {
            questionIndex: index,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            selectedAnswer: userAnswer?.selectedAnswer ?? null,
            isCorrect: userAnswer?.isCorrect || false,
            explanation: question.explanation
        };
        });

        res.status(200).json({
        success: true,
        data: {
            quiz: {
            id: quiz._id,
            title: quiz.title,
            document: quiz.documentId,
            score: quiz.score,
            totalQuestions:quiz.totalQuestions,
            completedAt:quiz.completedAt
            },
            results:detailedResults
        }
        });
    } 
    catch (error) {
        next(error)
    }
}

//@desc delete a quiz
//route DELETE /api/quizzes/:documentId
//@access Private
export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found',
        statusCode: 404
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};