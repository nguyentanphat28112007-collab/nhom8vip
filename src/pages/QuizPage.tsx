import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';
import {
  BrainCircuit,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Award,
  ArrowRight,
  ArrowLeft,
  CalendarClock,
  History,
  TrendingUp,
} from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { courses, recordQuizAttempt, quizAttempts, setActiveTab, addToast } = useApp();

  // Generator Configuration State
  const [subject, setSubject] = useState(courses[0]?.name || 'Lập trình C');
  const [topic, setTopic] = useState('Con trỏ, Mảng động và Quản lý bộ nhớ');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [numQuestions, setNumQuestions] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz State
  const [quizState, setQuizState] = useState<'config' | 'taking' | 'result'>('config');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(300); // 5 mins
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);

  // Result state
  const [finalScore, setFinalScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Countdown timer during taking quiz
  useEffect(() => {
    let timer: any;
    if (quizState === 'taking' && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            handleAutoSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
        setTimeTakenSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizState, timeLeftSeconds]);

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          numQuestions: Number(numQuestions),
        }),
      });

      const data = await res.json();
      setCurrentQuestions(data.questions);
      setCurrentQIndex(0);
      setUserAnswers({});
      setTimeLeftSeconds(numQuestions * 60);
      setTimeTakenSeconds(0);
      setQuizState('taking');
      addToast({
        type: 'success',
        title: 'Đề thi đã sẵn sàng!',
        message: `Bắt đầu làm bài kiểm tra ${numQuestions} câu môn ${subject}.`,
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Lỗi sinh đề',
        message: 'Đã sử dụng bộ đề mẫu chuẩn bị sẵn.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIndex,
    }));
  };

  const handleAutoSubmitQuiz = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    let wrong = 0;

    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correct += 1;
      } else {
        wrong += 1;
      }
    });

    const score = Number(((correct / currentQuestions.length) * 10).toFixed(1));
    setFinalScore(score);
    setCorrectCount(correct);
    setWrongCount(wrong);
    setQuizState('result');

    // Save to App State History
    const formattedDifficulty: 'Easy' | 'Medium' | 'Hard' =
      difficulty === 'easy' ? 'Easy' : difficulty === 'hard' ? 'Hard' : 'Medium';

    recordQuizAttempt({
      title: `Bài kiểm tra ${subject} - ${topic}`,
      subject: subject,
      chapter: topic,
      difficulty: formattedDifficulty,
      questionType: 'Multiple Choice',
      score,
      totalQuestions: currentQuestions.length,
      correctCount: correct,
      wrongCount: wrong,
      timeSpentSeconds: timeTakenSeconds,
      questions: currentQuestions,
    });
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="quiz-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              BƯỚC 3 & 4 TRONG LUỒNG DEMO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            AI Quiz Generator & Test Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tự động biên soạn đề trắc nghiệm thông minh, tính giờ thi thật và giải thích cặn kẽ từng câu hỏi.
          </p>
        </div>

        {quizState !== 'config' && (
          <button
            onClick={() => setQuizState('config')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tạo bài thi mới</span>
          </button>
        )}
      </div>

      {/* STATE 1: QUIZ GENERATOR CONFIGURATION FORM */}
      {quizState === 'config' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Generator Form (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Thiết Lập Đề Thi AI</h3>
                <p className="text-xs text-slate-400">Tùy chỉnh môn học, độ khó và số lượng câu hỏi</p>
              </div>
            </div>

            <form onSubmit={handleGenerateQuiz} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Môn Học *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-violet-500 focus:outline-hidden"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chủ Đề / Chương Học *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Con trỏ C, Cây BST, Đồ thị Euler, Thuyết nhận thức..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-violet-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Độ Khó</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-violet-500 focus:outline-hidden"
                  >
                    <option value="easy">Dễ (Nhận biết cơ bản)</option>
                    <option value="medium">Trung bình (Hiểu & Vận dụng)</option>
                    <option value="hard">Khó (Đề thi tuyển chọn / Nâng cao)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Số Câu Hỏi</label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-violet-500 focus:outline-hidden"
                  >
                    <option value={3}>3 câu (Khảo sát nhanh - 3 phút)</option>
                    <option value={5}>5 câu (Tiêu chuẩn - 5 phút)</option>
                    <option value={10}>10 câu (Luyện thi - 10 phút)</option>
                    <option value={15}>15 câu (Đề thi thử đầy đủ - 15 phút)</option>
                  </select>
                </div>
              </div>

              {/* Sample Topics Quick Select */}
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1.5">Gợi ý chủ đề thi hot:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Con trỏ và cấp phát động malloc',
                    'Cây nhị phân tìm kiếm BST',
                    'Đồ thị Euler & Hamilton',
                    'Thuyết hành vi Pavlov & Skinner',
                  ].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTopic(t)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                id="generate-quiz-btn"
                disabled={isGenerating}
                className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 hover:from-violet-500 hover:to-indigo-500 active:scale-98 text-white font-bold text-sm shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>AI đang biên soạn đề trắc nghiệm...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Bắt Đầu Làm Bài Kiểm Tra Ngay &rarr;</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Past Quiz Attempts History Log (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <History className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Lịch Sử Thi Thử ({quizAttempts.length})</h3>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
              {quizAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{attempt.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Đúng {attempt.correctCount}/{attempt.totalQuestions} câu • {Math.floor(attempt.timeSpentSeconds / 60)}p {attempt.timeSpentSeconds % 60}s
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{attempt.date}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-base font-extrabold px-2.5 py-1 rounded-xl border ${
                        attempt.score >= 8
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : attempt.score >= 5
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {attempt.score}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: LIVE INTERACTIVE TEST ENGINE */}
      {quizState === 'taking' && currentQuestions.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          {/* Top Bar with Timer & Question Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                {subject} • {topic}
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Câu Hỏi {currentQIndex + 1} / {currentQuestions.length}
              </h2>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-white font-mono text-sm font-bold shadow-inner">
                <Clock className="w-4 h-4 text-violet-400 animate-pulse" />
                <span>Thời gian còn: {formatTimer(timeLeftSeconds)}</span>
              </div>

              <button
                onClick={handleSubmitQuiz}
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Nộp Bài Thi
              </button>
            </div>
          </div>

          {/* Question Index Navigator Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {currentQuestions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQIndex(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentQIndex === idx
                    ? 'bg-violet-600 text-white ring-2 ring-violet-400'
                    : userAnswers[idx] !== undefined
                    ? 'bg-slate-800 text-violet-300 border border-violet-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Current Question Statement */}
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {currentQuestions[currentQIndex].question}
            </p>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {currentQuestions[currentQIndex].options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQIndex] === optIdx;
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-violet-950/40 border-violet-500/60 text-white shadow-md shadow-violet-950/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                          isSelected
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{opt}</span>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-violet-400 bg-violet-600' : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Next/Prev Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentQIndex === 0}
              onClick={() => setCurrentQIndex((prev) => Math.max(prev - 1, 0))}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            {currentQIndex < currentQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQIndex((prev) => prev + 1)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>Câu tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30"
              >
                Nộp Bài Hoàn Tất
              </button>
            )}
          </div>
        </div>
      )}

      {/* STATE 3: DETAILED SCORE REPORT & AI EXPLANATION */}
      {quizState === 'result' && (
        <div className="space-y-6">
          {/* Result Card Hero */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-violet-400" />
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider">
                  Kết quả bài thi trắc nghiệm
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {finalScore >= 8 ? 'Xuất Sắc! 🎉' : finalScore >= 5 ? 'Làm Tốt Lắm! 👍' : 'Cần Ôn Lại Bài 📖'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Bạn đã hoàn thành bài kiểm tra {subject} trong {Math.floor(timeTakenSeconds / 60)} phút {timeTakenSeconds % 60} giây.
              </p>

              <div className="flex items-center gap-4 mt-4 text-xs font-semibold">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Đúng {correctCount} câu
                </span>
                <span className="text-rose-400 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  Sai {wrongCount} câu
                </span>
              </div>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950 border border-slate-800 min-w-[160px] text-center shadow-inner">
              <span className="text-xs text-slate-400 font-medium">Điểm số</span>
              <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 my-1">
                {finalScore}/10
              </span>
              <span className="text-[11px] text-violet-400 font-semibold">
                {Math.round((correctCount / currentQuestions.length) * 100)}% Chính xác
              </span>
            </div>
          </div>

          {/* AI Follow-up Recommendation CTA */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Bước 5: Lập Kế Hoạch Ôn Tập Lỗ Hổng Kiến Thức</span>
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                AI phát hiện bạn còn lúng túng ở phần bài tập vận dụng. Tạo ngay Study Plan để củng cố trước kỳ thi.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('planner')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Tạo Study Plan Ngay</span>
            </button>
          </div>

          {/* Detailed Question Review with AI Explanations */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Xem lại chi tiết từng câu hỏi & Giải thích AI</h3>

            {currentQuestions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-3xl border space-y-3 ${
                    isCorrect
                      ? 'bg-slate-900/90 border-emerald-500/30'
                      : 'bg-slate-900/90 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                      Câu {idx + 1}: {q.question}
                    </p>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{isCorrect ? 'Chính xác' : 'Sai'}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oIdx) => {
                      const isUserChoice = userAns === oIdx;
                      const isActualCorrect = q.correctAnswer === oIdx;
                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-xl text-xs border flex items-center justify-between ${
                            isActualCorrect
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-bold'
                              : isUserChoice && !isCorrect
                              ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 font-semibold'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span>
                            <strong className="mr-1.5 font-mono">{String.fromCharCode(65 + oIdx)}.</strong>
                            {opt}
                          </span>
                          {isActualCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isUserChoice && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Explanation Box */}
                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-xs leading-relaxed">
                    <strong className="text-indigo-400 block mb-1">💡 Giải thích của AI:</strong>
                    <span className="text-slate-300">{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={() => setQuizState('config')}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg"
            >
              Tạo Thêm Đề Thi Mới
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
