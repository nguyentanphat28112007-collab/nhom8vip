import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  TrendingUp,
  Target,
  Plus,
  Edit2,
  CheckCircle2,
  Calculator,
  Sparkles,
  BookOpen,
  HelpCircle,
  BarChart3,
} from 'lucide-react';

export const GradesPage: React.FC = () => {
  const {
    courses,
    courseGrades,
    updateGradeScore,
    addGradeComponent,
    addToast,
  } = useApp();
  const { user } = useAuth();

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    courses[0]?.id || ''
  );

  // Target Score Calculator State
  const [calcCourseId, setCalcCourseId] = useState<string>(courses[0]?.id || '');
  const [desiredFinalGrade, setDesiredFinalGrade] = useState<number>(8.5);
  const [requiredScoreResult, setRequiredScoreResult] = useState<number | null>(null);

  // Add Component Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [compName, setCompName] = useState('');
  const [compWeight, setCompWeight] = useState(20);
  const [compScore, setCompScore] = useState<number | null>(8.5);

  // Overall GPA Calculation
  let totalCredits = 0;
  let totalPointsWeighted = 0;
  courses.forEach((c) => {
    totalCredits += c.credits;
    totalPointsWeighted += c.averageGrade * c.credits;
  });

  const overall10 = totalCredits > 0 ? totalPointsWeighted / totalCredits : 8.2;
  // Convert 10-scale to 4-scale approx
  const overall4 = (overall10 / 10) * 4;

  const targetGpa = user?.gpaTarget || 3.6;

  // Final Exam Score Predictor
  const handleCalculateRequired = () => {
    const courseGrade = courseGrades.find((cg) => cg.courseId === calcCourseId);
    if (!courseGrade) return;

    // Find components with scores and components missing score (assumed to be Final Exam)
    let currentWeightedSum = 0;
    let finalWeight = 50; // default assumption

    const finalComp = courseGrade.components.find((c) =>
      c.name.toLowerCase().includes('cuối kỳ') || c.name.toLowerCase().includes('final')
    );

    if (finalComp) {
      finalWeight = finalComp.weightPercent;
      courseGrade.components.forEach((c) => {
        if (c.id !== finalComp.id && c.score !== null) {
          currentWeightedSum += (c.score * c.weightPercent) / 100;
        }
      });
    } else {
      // If no explicit final, assume last component
      const last = courseGrade.components[courseGrade.components.length - 1];
      if (last) {
        finalWeight = last.weightPercent;
        courseGrade.components.slice(0, -1).forEach((c) => {
          if (c.score !== null) {
            currentWeightedSum += (c.score * c.weightPercent) / 100;
          }
        });
      }
    }

    const needed = (desiredFinalGrade - currentWeightedSum) / (finalWeight / 100);
    setRequiredScoreResult(Number(needed.toFixed(2)));
  };

  const getLetterGrade = (score10: number): { letter: string; gpa4: number; color: string } => {
    if (score10 >= 8.5) return { letter: 'A (Giỏi)', gpa4: 4.0, color: 'text-emerald-400' };
    if (score10 >= 8.0) return { letter: 'B+ (Khá giỏi)', gpa4: 3.5, color: 'text-indigo-400' };
    if (score10 >= 7.0) return { letter: 'B (Khá)', gpa4: 3.0, color: 'text-blue-400' };
    if (score10 >= 6.5) return { letter: 'C+ (Trung bình khá)', gpa4: 2.5, color: 'text-amber-400' };
    if (score10 >= 5.5) return { letter: 'C (Trung bình)', gpa4: 2.0, color: 'text-amber-500' };
    if (score10 >= 5.0) return { letter: 'D+ (Trung bình yếu)', gpa4: 1.5, color: 'text-rose-400' };
    if (score10 >= 4.0) return { letter: 'D (Yếu)', gpa4: 1.0, color: 'text-rose-400' };
    return { letter: 'F (Trượt môn)', gpa4: 0.0, color: 'text-rose-500 font-bold' };
  };

  const handleSaveComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;

    addGradeComponent(selectedCourseId, compName, compWeight, compScore);
    setShowAddModal(false);
    setCompName('');
  };

  const selectedCourseGrade = courseGrades.find((cg) => cg.courseId === selectedCourseId);
  const activeCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div id="grades-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Quản lý Điểm số & Dự phóng GPA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Grades & Academic Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi chi tiết điểm thành phần, tính toán GPA thang 4 / thang 10 và dự báo điểm thi cần đạt.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm đầu điểm môn</span>
          </button>
        </div>
      </div>

      {/* GPA Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Current GPA (10 scale) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider">GPA Thang 10</span>
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">{overall10.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/ 10.0</span>
          </div>
          <p className="text-[11px] text-indigo-300/80 mt-1">Xếp loại: {getLetterGrade(overall10).letter}</p>
        </div>

        {/* Current GPA (4 scale) */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">GPA Thang 4.0</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">{overall4.toFixed(2)}</span>
            <span className="text-xs text-slate-400">/ 4.00</span>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">Tổng số tín chỉ tích lũy: {totalCredits} TC</p>
        </div>

        {/* Target GPA */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider">Mục tiêu cá nhân</span>
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">{targetGpa.toFixed(2)}</span>
            <span className="text-xs text-slate-400">GPA Target</span>
          </div>
          <p className="text-[11px] text-amber-300/80 mt-1">
            {overall4 >= targetGpa ? '🎉 Bạn đang vượt mục tiêu!' : `Cần thêm +${(targetGpa - overall4).toFixed(2)} để đạt chỉ tiêu`}
          </p>
        </div>
      </div>

      {/* Main Content: Course Grade Table + Final Exam Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Detailed Grade Components (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Course Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {courses.map((crs) => (
              <button
                key={crs.id}
                onClick={() => setSelectedCourseId(crs.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCourseId === crs.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {crs.name}
              </button>
            ))}
          </div>

          {/* Table Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white">{activeCourse?.name}</h3>
                <p className="text-xs text-slate-400">
                  {activeCourse?.code} • {activeCourse?.credits} Tín chỉ • Giảng viên: {activeCourse?.lecturer}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Điểm trung bình môn:</span>
                <p className="text-xl font-extrabold text-indigo-400">
                  {activeCourse?.averageGrade.toFixed(1)} / 10
                </p>
              </div>
            </div>

            {/* Components Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Thành phần đánh giá</th>
                    <th className="pb-3 font-semibold">Trọng số (%)</th>
                    <th className="pb-3 font-semibold">Điểm số (Thang 10)</th>
                    <th className="pb-3 font-semibold">Quy đổi</th>
                    <th className="pb-3 font-semibold text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {selectedCourseGrade?.components.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        {comp.name}
                      </td>
                      <td className="py-3.5 text-slate-300 font-semibold">{comp.weightPercent}%</td>
                      <td className="py-3.5">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={comp.score !== null ? comp.score : ''}
                          placeholder="Chưa có"
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : Number(e.target.value);
                            updateGradeScore(selectedCourseId, comp.id, Math.min(Math.max(val, 0), 10));
                          }}
                          className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-white font-bold text-xs focus:outline-hidden focus:border-indigo-500"
                        />
                      </td>
                      <td className="py-3.5">
                        {comp.score !== null ? (
                          <span className="font-semibold text-slate-300">
                            {((comp.score * comp.weightPercent) / 100).toFixed(2)} đ
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Chờ thi</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Tự động lưu
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scale Conversion Reference */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Quy đổi thang chữ:</span>
              <span>A (8.5 - 10): 4.0</span>
              <span>B+ (8.0 - 8.4): 3.5</span>
              <span>B (7.0 - 7.9): 3.0</span>
              <span>C+ (6.5 - 6.9): 2.5</span>
              <span>C (5.5 - 6.4): 2.0</span>
              <span>D (4.0 - 5.4): 1.0</span>
            </div>
          </div>
        </div>

        {/* Right: Final Exam Score Predictor Calculator */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">Dự báo Điểm Thi Cần Đạt</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nhập mục tiêu điểm môn học, hệ thống sẽ tính toán chính xác số điểm bạn cần đạt trong bài thi cuối kỳ!
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Môn học cần tính</label>
              <select
                value={calcCourseId}
                onChange={(e) => setCalcCourseId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Điểm tổng kết mong muốn (Thang 10)
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="10"
                value={desiredFinalGrade}
                onChange={(e) => setDesiredFinalGrade(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleCalculateRequired}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tính toán điểm thi cuối kỳ</span>
            </button>

            {requiredScoreResult !== null && (
              <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-center animate-in fade-in slide-in-from-bottom-2">
                <span className="text-xs text-indigo-300 font-semibold">Điểm thi cuối kỳ cần đạt tối thiểu:</span>
                <p className="text-3xl font-extrabold text-white mt-1">
                  {requiredScoreResult <= 10 ? `${requiredScoreResult} / 10` : 'Không khả thi (> 10)'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {requiredScoreResult <= 8.5
                    ? '🎯 Mục tiêu hoàn toàn trong tầm tay nếu bạn duy trì ôn tập theo AI Study Plan!'
                    : '⚠️ Cần tập trung cao độ và làm thêm các bộ đề trắc nghiệm để đạt kết quả này.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Component Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Thêm thành phần điểm</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSaveComponent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên đầu điểm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bài tập nhóm, Báo cáo Lab 2..."
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Trọng số (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={compWeight}
                    onChange={(e) => setCompWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Điểm ban đầu (nếu có)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={compScore || ''}
                    onChange={(e) => setCompScore(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  Lưu đầu điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
