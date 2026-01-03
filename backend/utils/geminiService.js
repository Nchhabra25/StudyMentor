import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

/* =========================
   ENV VALIDATION
========================= */
if (!process.env.GEMINI_API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY is missing.");
  process.exit(1);
}

/* =========================
   GEMINI INIT
========================= */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  // Change "gemini-pro" to "gemini-2.5-flash"
  model: "gemini-2.5-flash", 
});

/* =========================
   FLASHCARDS
========================= */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `
Generate exactly ${count} educational flashcards from the following text.

Format:
Q: Question
A: Answer
D: easy | medium | hard

Separate each flashcard using ---
  
Text:
${text.substring(0, 15000)}
`;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    const flashcards = generatedText
      .split("---")
      .map(card => {
        const lines = card.trim().split("\n");
        let question = "";
        let answer = "";
        let difficulty = "medium";

        for (const line of lines) {
          if (line.startsWith("Q:")) question = line.slice(2).trim();
          if (line.startsWith("A:")) answer = line.slice(2).trim();
          if (line.startsWith("D:")) {
            const d = line.slice(2).trim().toLowerCase();
            if (["easy", "medium", "hard"].includes(d)) difficulty = d;
          }
        }

        return question && answer
          ? { question, answer, difficulty }
          : null;
      })
      .filter(Boolean)
      .slice(0, count);

    return flashcards;
  } catch (err) {
    console.error("Gemini Flashcard Error:", err);
    throw new Error("Failed to generate flashcards");
  }
};

/* =========================
   QUIZ GENERATOR
========================= */
export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `
Generate exactly ${numQuestions} MCQs from the text.

Format:
Q: Question
01: Option
02: Option
03: Option
04: Option
C: Correct option (exact text)
E: Explanation
D: easy | medium | hard

Separate questions using ---

Text:
${text.substring(0, 15000)}
`;

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();

    const questions = generatedText
      .split("---")
      .map(block => {
        const lines = block.trim().split("\n");
        let question = "";
        let options = [];
        let correctAnswer = "";
        let explanation = "";
        let difficulty = "medium";

        for (const line of lines) {
          if (line.startsWith("Q:")) question = line.slice(2).trim();
          else if (/^0\d:/.test(line)) options.push(line.slice(3).trim());
          else if (line.startsWith("C:")) correctAnswer = line.slice(2).trim();
          else if (line.startsWith("E:")) explanation = line.slice(2).trim();
          else if (line.startsWith("D:")) {
            const d = line.slice(2).trim().toLowerCase();
            if (["easy", "medium", "hard"].includes(d)) difficulty = d;
          }
        }

        return question && options.length === 4 && correctAnswer
          ? { question, options, correctAnswer, explanation, difficulty }
          : null;
      })
      .filter(Boolean);

    return questions;
  } catch (err) {
    console.error("Gemini Quiz Error:", err);
    throw new Error("Failed to generate quiz");
  }
};

/* =========================
   SUMMARY
========================= */
export const generateSummary = async (text) => {
  const prompt = `
Summarize the following text clearly.
Focus on key ideas and concepts.

Text:
${text.substring(0, 20000)}
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Summary Error:", err);
    throw new Error("Failed to generate summary");
  }
};

/* =========================
   CHAT WITH CONTEXT
========================= */
export const chatWithContext = async (question, chunks) => {
  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join("\n\n");

  const prompt = `
Answer the user's question strictly using the context below.
If the answer is not present, say so.

Context:
${context}

Question:
${question}

Answer:
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Chat Error:", err);
    throw new Error("Failed to answer question");
  }
};

/* =========================
   EXPLAIN CONCEPT
========================= */
export const explainConcept = async (concept, context) => {
  const prompt = `
Explain "${concept}" using the context below.
Keep it simple and educational.

Context:
${context.substring(0, 10000)}
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Explain Error:", err);
    throw new Error("Failed to explain concept");
  }
};
