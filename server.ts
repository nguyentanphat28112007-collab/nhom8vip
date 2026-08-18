import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import {
  generateAIChat,
  analyzeDocumentContent,
  generateQuizQuestions,
  generateFlashcardsAI,
  generateStudyPlanAI,
  analyzeLearningPerformanceAI,
} from "./server/geminiService.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    });
  });

  // AI Chat Route
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages, context } = req.body;
      if (!Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array is required" });
      }
      const response = await generateAIChat(messages, context);
      res.json({ response });
    } catch (error: any) {
      console.error("AI Chat route error:", error);
      res.status(500).json({ error: error.message || "Lỗi xử lý phản hồi AI" });
    }
  });

  // AI Document Analysis Route
  app.post("/api/ai/analyze-document", async (req, res) => {
    try {
      const { title, content, type } = req.body;
      if (!content) {
        return res.status(400).json({ error: "Document content is required" });
      }
      const result = await analyzeDocumentContent(title || "Tài liệu học tập", content, type || "summary");
      res.json({ result });
    } catch (error: any) {
      console.error("Document Analysis route error:", error);
      res.status(500).json({ error: error.message || "Lỗi phân tích tài liệu" });
    }
  });

  // AI Quiz Generation Route
  app.post("/api/ai/generate-quiz", async (req, res) => {
    try {
      const { subject, chapter, difficulty, questionType, count, content } = req.body;
      const questions = await generateQuizQuestions({
        subject: subject || "Lập trình C",
        chapter: chapter || "Tổng hợp",
        difficulty: difficulty || "Medium",
        questionType: questionType || "Multiple Choice",
        count: count || 5,
        content: content || "",
      });
      res.json({ questions });
    } catch (error: any) {
      console.error("Quiz Generator route error:", error);
      res.status(500).json({ error: error.message || "Lỗi tạo bài trắc nghiệm" });
    }
  });

  // AI Flashcard Generation Route
  app.post("/api/ai/generate-flashcards", async (req, res) => {
    try {
      const { subject, topic, count, content } = req.body;
      const flashcards = await generateFlashcardsAI({
        subject: subject || "Cấu trúc dữ liệu",
        topic: topic || "Tổng quan",
        count: count || 6,
        content: content || "",
      });
      res.json({ flashcards });
    } catch (error: any) {
      console.error("Flashcards Generator route error:", error);
      res.status(500).json({ error: error.message || "Lỗi tạo flashcards" });
    }
  });

  // AI Study Plan Route
  app.post("/api/ai/generate-study-plan", async (req, res) => {
    try {
      const { subject, examDate, targetGrade, availableHoursPerDay, currentLevel } = req.body;
      const plan = await generateStudyPlanAI({
        subject: subject || "Cấu trúc dữ liệu và giải thuật",
        examDate: examDate || "20/09/2026",
        targetGrade: targetGrade || "A (8.5+)",
        availableHoursPerDay: availableHoursPerDay || 2,
        currentLevel: currentLevel || "Khá",
      });
      res.json({ plan });
    } catch (error: any) {
      console.error("Study Plan Generator route error:", error);
      res.status(500).json({ error: error.message || "Lỗi tạo kế hoạch học tập" });
    }
  });

  // AI Learning Performance Analytics Route
  app.post("/api/ai/analyze-performance", async (req, res) => {
    try {
      const { courses, completedTasks, totalTasks, recentQuizScores } = req.body;
      const analysis = await analyzeLearningPerformanceAI({
        courses: courses || [],
        completedTasks: completedTasks || 0,
        totalTasks: totalTasks || 0,
        recentQuizScores: recentQuizScores || [],
      });
      res.json({ analysis });
    } catch (error: any) {
      console.error("Performance Analysis route error:", error);
      res.status(500).json({ error: error.message || "Lỗi phân tích kết quả học tập" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Study Assistant Server running on http://localhost:${PORT}`);
  });
}

startServer();
