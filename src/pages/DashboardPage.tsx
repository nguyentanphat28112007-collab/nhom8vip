import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { DemoBanner } from '../components/common/DemoBanner';
import {
  BookOpen,
  CheckSquare,
  Clock,
  Award,
  Flame,
  Calendar,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Bot,
  Plus,
  Play,
  TrendingUp,
  BrainCircuit,
  FileText,
  ChevronRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    courses,
    tasks,
    scheduleEvents,
    courseGrades,
    flashcardDecks,
    setActiveTab,
    setSelectedCourseId,
    updateTaskStatus,
  } = useApp();
  const { user } = useAuth();

  // Stats Calculations
  const totalCourses = courses.length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const upcomingDeadlines = tasks.filter((t) => t.status !== 'Completed' && t.priority === 'High');

  // GPA calculation across all courses
  let totalGradeWeighted = 0;
  let totalCredits = 0;
  courses.forEach((c) => {
    totalGradeWeighted += c.averageGrade * c.credits;
    totalCredits += c.credits;
  });
  const overallAverageGrade = totalCredits > 0 ? (totalGradeWeighted / totalCredits).toFixed(2) : '8.25';

  // Exams sorted by date
  const upcomingExams = scheduleEvents
    .filter((e) => e.type === 'exam')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Today's schedule events
  const todayStr = '2026-08-17';
  const todaySchedule = scheduleEvents
    .filter((e) => e.date === todayStr || e.type === 'class')
    .slice(0, 3);

  const getDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr);
    const today = new Date('2026-08-17');
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} ngày nữa` : 'Hôm nay';
  };

  return (
    <div id="dashboard-page" className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-indigo-400 font-semibold">Chào buổi sáng,</span>
            <span className="text-sm font-bold text-white">{user?.name || 'Sinh viên'} 👋</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Ready to continue your learning?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hôm nay bạn có 2 tiết học, 1 bài tập cần nộp và 1 buổi luyện đề DSA cùng AI.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="quick-start-quiz-btn"
            onClick={() => setActiveTab('quiz')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 cursor-pointer"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Tạo Quiz AI ngay</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Hỏi bài AI</span>
          </button>
        </div>
      </div>

      {/* Core Workflow Guided Banner */}
      <DemoBanner />

      {/* 5 Key Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Courses */}
        <div
          onClick={() => setActiveTab('courses')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">📚 Total Courses</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{totalCourses}</span>
            <span className="text-[11px] text-blue-400 font-semibold">môn đang học</span>
          </div>
          <div className="mt-2 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Tasks */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">📝 Active Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{pendingTasks.length}</span>
            <span className="text-[11px] text-amber-400 font-semibold">chưa hoàn thành</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Đã xong {completedTasks.length} việc</div>
        </div>

        {/* Upcoming Deadlines */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">⏰ Deadlines</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-400">{upcomingDeadlines.length}</span>
            <span className="text-[11px] text-rose-400/80 font-semibold">ưu tiên cao</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Bài tập lớn C (5 ngày)</div>
        </div>

        {/* Average Grade */}
        <div
          onClick={() => setActiveTab('grades')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">📊 Average Grade</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">{overallAverageGrade}</span>
            <span className="text-[11px] text-slate-400">/ 10.0</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-semibold">GPA: 3.52 (Giỏi)</div>
        </div>

        {/* Study Streak */}
        <div
          onClick={() => setActiveTab('analytics')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">🔥 Study Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">{user?.streakDays || 14}</span>
            <span className="text-[11px] text-slate-300 font-semibold">ngày liên tiếp</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-400/90 font-medium">Top 5% sinh viên chăm chỉ</div>
        </div>
      </div>

      {/* AI Recommendation Alert Card */}
      <div
        id="ai-recommendation-card"
        className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                AI Recommendation (Gợi ý học tập cá nhân hóa)
              </span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">
              "Bạn nên dành thêm thời gian ôn tập cho môn Cấu trúc Dữ liệu & Giải thuật (DSA)."
            </p>
            <p className="text-xs text-slate-400 mt-1">
              AI nhận thấy bạn còn 1 bài tập Cây BST chưa hoàn thành và kỳ thi giữa kỳ chỉ còn 12 ngày nữa.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setSelectedCourseId('course_dsa');
              setActiveTab('course_detail');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ôn tập ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid: Schedule & Tasks vs Exams & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Schedule & Upcoming Tasks (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Schedule */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">Lịch Học Hôm Nay (Today's Schedule)</h3>
              </div>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Xem toàn bộ lịch</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between hover:border-blue-500/40 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 text-center py-1.5 px-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                    08:00
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Lập trình C (Programming C)</h4>
                    <p className="text-[11px] text-slate-400">Phòng B2.04 • Con trỏ hàm & Quản lý file</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Lên lớp
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between hover:border-purple-500/40 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 text-center py-1.5 px-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-xs font-bold">
                    10:00
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Toán Rời rạc (Discrete Mathematics)</h4>
                    <p className="text-[11px] text-slate-400">Phòng C3.08 • Lý thuyết đồ thị Euler</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Lên lớp
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between hover:border-amber-500/40 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 text-center py-1.5 px-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                    14:00
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Tâm lý học Giáo dục (Educational Psychology)</h4>
                    <p className="text-[11px] text-slate-400">Phòng D1.205 • Thảo luận thuyết nhận thức</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Chiều nay
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks list with checkboxes */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base text-white">Nhiệm Vụ Cần Làm (Upcoming Tasks)</h3>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Quản lý Tasks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((tsk) => {
                const isDone = tsk.status === 'Completed';
                return (
                  <div
                    key={tsk.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => updateTaskStatus(tsk.id, isDone ? 'To Do' : 'Completed')}
                        className="w-4 h-4 rounded-md border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {tsk.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{tsk.courseName} • Hạn: {tsk.deadline}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                        tsk.priority === 'High'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : tsk.priority === 'Medium'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tsk.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Exams & Study Progress (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Exams Countdown */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-base text-white">Lịch Thi Sắp Tới (Upcoming Exams)</h3>
              </div>
            </div>

            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{exam.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ngày thi: {exam.date} • {exam.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40 inline-block">
                      {getDaysLeft(exam.date)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
                <button
                  onClick={() => setActiveTab('planner')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1.5 w-full"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tạo kế hoạch ôn thi bằng AI ngay</span>
                </button>
              </div>
            </div>
          </div>

          {/* Study Progress across courses */}
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Tiến Độ Môn Học (Study Progress)</h3>
              </div>
            </div>

            <div className="space-y-3.5">
              {courses.map((crs) => (
                <div
                  key={crs.id}
                  onClick={() => {
                    setSelectedCourseId(crs.id);
                    setActiveTab('course_detail');
                  }}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white truncate max-w-[180px]">{crs.name}</span>
                    <span className="font-mono font-bold text-indigo-400">{crs.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${crs.progress}%`,
                        backgroundColor: crs.color || '#6366f1',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>{crs.code}</span>
                    <span>Điểm TB: {crs.averageGrade}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
