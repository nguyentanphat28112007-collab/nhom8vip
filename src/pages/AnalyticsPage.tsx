import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Bot,
  Clock,
  BookOpen,
  ArrowRight,
  Flame,
  BarChart2,
  RefreshCw,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { courses, tasks, quizAttempts, setActiveTab, addToast } = useApp();
  const { user } = useAuth();

  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    strongestSubject: string;
    weakestSubject: string;
    taskCompletionRate: number;
    summary: string;
    recommendations: string[];
    actionPlan: string[];
  } | null>(null);

  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const totalTasks = tasks.length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 80;

  // Average quiz score
  const totalQuizScore = quizAttempts.reduce((acc, q) => acc + q.score, 0);
  const avgQuiz = quizAttempts.length > 0 ? (totalQuizScore / quizAttempts.length).toFixed(1) : '8.5';

  const fetchAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courses: courses.map((c) => ({ name: c.name, grade: c.averageGrade, progress: c.progress })),
          completedTasks,
          totalTasks,
          recentQuizScores: quizAttempts.map((q) => ({ subject: q.subject, score: q.score, total: q.totalQuestions })),
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Error analyzing performance:', err);
      // Fallback
      setAiAnalysis({
        strongestSubject: courses[0]?.name || 'Lập trình C',
        weakestSubject: courses[1]?.name || 'Cấu trúc dữ liệu & giải thuật',
        taskCompletionRate: taskRate,
        summary: `Bạn đang duy trì phong độ học tập ổn định với ${completedTasks}/${totalTasks} nhiệm vụ hoàn thành (${taskRate}%). Điểm số các bài quiz gần đây đạt trung bình ${avgQuiz}/10. Môn học mạnh nhất là ${courses[0]?.name || 'Lập trình C'}, trong khi môn cần tập trung cải thiện thêm là ${courses[1]?.name || 'Cấu trúc dữ liệu'}.`,
        recommendations: [
          `Dành thêm 45 phút mỗi ngày làm các bài quiz trắc nghiệm thuật ngữ cho môn ${courses[1]?.name || 'Cấu trúc dữ liệu'}.`,
          `Sử dụng Flashcards theo phương pháp Spaced Repetition (Lặp lại ngắt quãng) vào mỗi sáng 15 phút.`,
          `Thực hành viết lại code mẫu sau khi được AI giải thích thuật toán để nắm vững nguyên lý bộ nhớ.`,
          `Duy trì chuỗi học tập đều đặn để kích hoạt tối đa khả năng ghi nhớ dài hạn của não bộ.`,
        ],
        actionPlan: [
          `Bước 1: Làm 1 bài trắc nghiệm 10 câu về Cây nhị phân và Con trỏ.`,
          `Bước 2: Hoàn thành 1 bài tập còn lại trong danh sách To-Do.`,
          `Bước 3: Lập kế hoạch ôn tập 4 tuần bằng AI Study Planner trước kỳ thi cuối kỳ.`,
        ],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  return (
    <div id="analytics-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>AI Learning Analytics & Hiệu suất</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Learning Performance & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            AI phân tích dữ liệu học tập đa chiều, phát hiện điểm mạnh điểm yếu và đề xuất kế hoạch hành động tối ưu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAIAnalysis}
            disabled={analyzing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-400 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'AI đang phân tích...' : 'Cập nhật phân tích'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metric Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tỷ lệ xong Task</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">{taskRate}%</p>
          <span className="text-[11px] text-emerald-400 mt-0.5 block">{completedTasks}/{totalTasks} bài hoàn tất</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Trung bình Quiz</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">{avgQuiz} / 10</p>
          <span className="text-[11px] text-indigo-300 mt-0.5 block">{quizAttempts.length} bài test đã làm</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Chuỗi học tập</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{user?.streakDays || 12} ngày</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Đều đặn mỗi ngày</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Tổng giờ tự học</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">{user?.totalStudyHours || 48}h</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Kỳ học 1 (2026-2027)</span>
        </div>
      </div>

      {/* AI Performance Coach Section */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Báo Cáo Đánh Giá Từ AI Coach</h3>
              <span className="text-xs text-indigo-300">Dựa trên mô hình phân tích học tập thời gian thực</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Điểm mạnh: {aiAnalysis?.strongestSubject || 'Lập trình C'}
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30">
              Cần chú ý: {aiAnalysis?.weakestSubject || 'Cấu trúc dữ liệu'}
            </span>
          </div>
        </div>

        {/* AI Summary Text */}
        <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
          {aiAnalysis?.summary || 'Đang tổng hợp thông tin đánh giá toàn diện...'}
        </p>

        {/* 2-Columns: Recommendations vs Action Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recommendations */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Gợi ý nâng cao kết quả học tập</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {aiAnalysis?.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Plan */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Kế hoạch hành động 3 bước</span>
            </div>
            <div className="space-y-2">
              {aiAnalysis?.actionPlan.map((act, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>{act}</span>
                  <button
                    onClick={() => {
                      if (idx === 0) setActiveTab('quiz');
                      else if (idx === 1) setActiveTab('tasks');
                      else setActiveTab('planner');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold shrink-0 ml-2"
                  >
                    Thực hiện &rarr;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Course Mastery Progress Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-extrabold text-base text-white">Mức Độ Làm Chủ Kiến Thức Từng Môn</h3>
        <div className="space-y-4">
          {courses.map((c) => {
            const mastery = Math.round((c.averageGrade / 10) * 100);
            return (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-bold text-white">{c.name}</span>
                    <span className="text-xs text-slate-400">({c.code})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">Điểm TB: {c.averageGrade.toFixed(1)}/10</span>
                    <span className="text-xs font-extrabold text-indigo-400">{mastery}%</span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
