import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyPlan } from '../types';
import {
  CalendarClock,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight,
  Plus,
  BookOpen,
  Award,
  Layers,
  ChevronRight,
  ListTodo,
} from 'lucide-react';

export const StudyPlannerPage: React.FC = () => {
  const {
    courses,
    studyPlans,
    addStudyPlan,
    syncPlanToCalendar,
    setActiveTab,
    addToast,
  } = useApp();

  const [subject, setSubject] = useState(courses[0]?.name || 'Lập trình C');
  const [examDate, setExamDate] = useState('2026-08-30');
  const [targetScore, setTargetScore] = useState('Điểm A+ (GPA 4.0 / 9.0+)');
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [isGenerating, setIsGenerating] = useState(false);

  const activePlan = studyPlans[0];

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          examDate,
          targetScore,
          hoursPerDay: Number(hoursPerDay),
        }),
      });

      const data = await res.json();
      addStudyPlan({
        title: `Kế hoạch ôn thi ${subject}`,
        subject,
        targetGrade: targetScore,
        examDate,
        dailyHours: Number(hoursPerDay) || 2,
        totalWeeks: data.totalWeeks || 2,
        weeks: data.weeks || [],
        keyStrategies: [
          'Duy trì ôn tập cách ngày theo phương pháp Spaced Repetition',
          'Luyện đề thi thử 45 phút dưới áp lực thời gian thực',
        ],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSyncToCalendar = (planId: string) => {
    syncPlanToCalendar(planId);
  };

  return (
    <div id="study-planner-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              BƯỚC 6 & 7 TRONG LUỒNG DEMO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            AI Study Planner & Lộ Trình Ôn Thi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tự động lập kế hoạch phân bổ thời gian học tập theo tuần, mục tiêu điểm số và đồng bộ trực tiếp vào Calendar.
          </p>
        </div>

        {activePlan && (
          <button
            onClick={() => handleSyncToCalendar(activePlan.id)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>
              {activePlan.syncedToCalendar
                ? 'Đã Đồng Bộ Vào Lịch (Đồng bộ lại)'
                : 'Đồng Bộ Lộ Trình Vào Calendar 📅'}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Study Plan Generator Form (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Thiết Lập Mục Tiêu Ôn Thi</h3>
              <p className="text-xs text-slate-400">AI tối ưu hóa khối lượng kiến thức theo thời gian</p>
            </div>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Môn Học Cần Ôn Tập *</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ngày Thi Dự Kiến *</label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mục Tiêu Điểm Số</label>
              <select
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden"
              >
                <option value="Điểm A+ (GPA 4.0 / 9.0 - 10.0)">Điểm A+ (GPA 4.0 / 9.0 - 10.0)</option>
                <option value="Điểm A (GPA 3.7 / 8.5 - 8.9)">Điểm A (GPA 3.7 / 8.5 - 8.9)</option>
                <option value="Điểm B+ (GPA 3.5 / 8.0 - 8.4)">Điểm B+ (GPA 3.5 / 8.0 - 8.4)</option>
                <option value="Điểm B (GPA 3.0 / 7.0 - 7.9)">Điểm B (GPA 3.0 / 7.0 - 7.9)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Thời Gian Tự Học Mỗi Ngày: <strong className="text-amber-400">{hoursPerDay} tiếng</strong>
              </label>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1h / ngày</span>
                <span>3h / ngày</span>
                <span>6h / ngày</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full mt-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>AI đang thiết lập lộ trình ôn thi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sinh Kế Hoạch Ôn Thi Bằng AI &rarr;</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Plan View & Weekly Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activePlan ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
              {/* Plan Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Lộ trình {activePlan.totalWeeks} tuần
                    </span>
                    <span className="text-xs text-slate-400">• Ngày thi: {activePlan.examDate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{activePlan.title}</h3>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    Mục tiêu: {activePlan.targetGrade}
                  </p>
                </div>

                <button
                  onClick={() => handleSyncToCalendar(activePlan.id)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{activePlan.syncedToCalendar ? 'Đã Đồng Bộ Lịch' : 'Đồng Bộ Calendar'}</span>
                </button>
              </div>

              {/* Weeks List */}
              <div className="space-y-4">
                {activePlan.weeks.map((week) => (
                  <div
                    key={week.weekNumber}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                          W{week.weekNumber}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{week.title}</h4>
                      </div>
                      <span className="text-[11px] text-indigo-400 font-semibold">
                        Trọng tâm: {week.focusTopics?.join(', ') || week.title}
                      </span>
                    </div>

                    {/* Task checklist for this week */}
                    <div className="space-y-2 pt-1">
                      {week.tasks.map((task, tIdx) => (
                        <div
                          key={tIdx}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="text-slate-200">{task.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                            {task.durationHours}h
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Pro Tip */}
                    {week.tip && (
                      <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-[11px] text-amber-300">
                        <strong>💡 Mẹo ôn thi từ AI:</strong> {week.tip}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Jump to Calendar CTA */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">Xem thời gian biểu trên Calendar</h5>
                  <p className="text-[11px] text-slate-400">Kiểm tra các phiên học đã được lên lịch tự động.</p>
                </div>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Mở Calendar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              <CalendarClock className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
              <p className="text-sm">Chưa có kế hoạch ôn thi nào. Nhấn "Sinh Kế Hoạch Ôn Thi Bằng AI" để tạo ngay!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
