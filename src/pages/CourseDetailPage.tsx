import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  BookOpen,
  FolderSync,
  FileText,
  CheckSquare,
  Sparkles,
  Bot,
  BrainCircuit,
  Layers,
  Upload,
  Plus,
  Calendar,
  Award,
  ExternalLink,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const {
    selectedCourseId,
    courses,
    documents,
    notes,
    tasks,
    courseGrades,
    setActiveTab,
    setSelectedCourseId,
    setSelectedDocumentId,
    addToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'materials' | 'notes' | 'tasks' | 'ai_tools'>('overview');
  const [topicToExplain, setTopicToExplain] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainedContent, setExplainedContent] = useState('');

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];
  if (!course) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-400">Không tìm thấy thông tin môn học.</p>
        <button
          onClick={() => setActiveTab('courses')}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-bold"
        >
          Quay lại danh sách môn học
        </button>
      </div>
    );
  }

  const courseDocs = documents.filter((d) => d.courseId === course.id);
  const courseNotes = notes.filter((n) => n.courseId === course.id);
  const courseTasks = tasks.filter((t) => t.courseId === course.id);
  const gradeData = courseGrades.find((g) => g.courseId === course.id);

  const handleExplainTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicToExplain.trim()) return;

    setIsExplaining(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToExplain,
          level: 'beginner',
          context: `Môn học: ${course.name} (${course.code}). Giảng viên: ${course.lecturer}`,
        }),
      });
      const data = await res.json();
      setExplainedContent(data.explanation);
    } catch (err) {
      console.error(err);
      setExplainedContent(
        `### Giải thích ${topicToExplain} trong môn ${course.name}\n\n**1. Khái niệm cốt lõi:**\n${topicToExplain} là một thành phần trọng tâm giúp sinh viên nắm bắt cấu trúc và thuật toán nền tảng.\n\n**2. Ẩn dụ thực tế:**\nHãy tưởng tượng nó giống như một tủ lưu trữ thông minh được đánh số ngăn ngăn nắp.\n\n**3. Ví dụ minh họa:**\n\`\`\`c\n// Ví dụ mã nguồn minh họa\nint x = 10;\nint *ptr = &x;\n\`\`\`\n\n**4. Mẹo khi thi:**\nNhớ kiểm tra các trường hợp biên và điều kiện dừng.`
      );
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div id="course-detail-page" className="space-y-6 pb-12">
      {/* Back Button and Course Hero Header */}
      <div>
        <button
          onClick={() => setActiveTab('courses')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách môn học</span>
        </button>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-2"
            style={{ backgroundColor: course.color || '#6366f1' }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {course.code}
                </span>
                <span className="text-xs text-slate-400">{course.term}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">{course.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 text-xs text-slate-400">
                <span>Giảng viên: <strong className="text-white">{course.lecturer}</strong></span>
                <span>Phòng: <strong className="text-white">{course.room}</strong></span>
                <span>Số tín chỉ: <strong className="text-white">{course.credits}</strong></span>
                <span>Điểm TB hiện tại: <strong className="text-emerald-400">{course.averageGrade}/10</strong></span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center min-w-[140px] shrink-0">
              <span className="text-[11px] text-slate-400 block">Tiến độ học</span>
              <span className="text-2xl font-extrabold text-indigo-400 mt-0.5 block">{course.progress}%</span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'overview', label: 'Tổng quan (Overview)', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'materials', label: `Tài liệu (${courseDocs.length})`, icon: <FolderSync className="w-4 h-4" /> },
          { id: 'notes', label: `Ghi chú (${courseNotes.length})`, icon: <FileText className="w-4 h-4" /> },
          { id: 'tasks', label: `Nhiệm vụ (${courseTasks.length})`, icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'ai_tools', label: 'AI Study Suite ✨', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`course-tab-${tab.id}`}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grades Breakdown */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>Thành phần điểm môn học</span>
              </h3>

              {gradeData ? (
                <div className="space-y-3">
                  {gradeData.components.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-white">{c.name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({c.weightPercent}%)</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {c.score !== null ? `${c.score}/10` : 'Chưa có điểm'}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('grades')}
                    className="w-full mt-2 py-2 text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Xem chi tiết bảng điểm &rarr;
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Chưa cấu hình thành phần điểm cho môn học này.</p>
              )}
            </div>

            {/* Quick AI Study Prompts */}
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  <span>AI Tutor môn {course.code}</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Sử dụng trợ lý AI chuyên biệt cho môn {course.name} để giải bài tập, tóm tắt bài giảng hoặc giải đề thi.
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setActiveTab('assistant');
                    }}
                    className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left text-xs text-slate-200 transition-colors flex items-center justify-between"
                  >
                    <span>💡 "Giải thích cho tôi các dạng bài tập hay thi của môn {course.name}"</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-violet-950/40 border border-slate-800 hover:border-violet-500/40 text-left text-xs text-slate-200 transition-colors flex items-center justify-between"
                  >
                    <span>🧠 "Tạo đề thi thử trắc nghiệm 10 câu cho môn này"</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('assistant')}
                className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>Mở Chat AI Chuyên Sâu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Materials Tab */}
      {activeSubTab === 'materials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Tài liệu học tập môn {course.name}</h3>
            <button
              onClick={() => setActiveTab('documents')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Tải Lên Tài Liệu Mới</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDocumentId(doc.id);
                  setActiveTab('document_detail');
                }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 uppercase">
                      {doc.fileType} • {doc.fileSize}
                    </span>
                    <span className="text-[10px] text-slate-400">{doc.uploadDate}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-2">{doc.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{doc.content}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Phân tích &rarr;</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{doc.tags.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Notes Tab */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Ghi chú môn {course.name}</h3>
            <button
              onClick={() => setActiveTab('notes')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Ghi Chú</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveTab('notes')}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all"
              >
                <h4 className="text-sm font-bold text-white">{note.title}</h4>
                <p className="text-xs text-slate-300 mt-1.5 line-clamp-3 leading-relaxed whitespace-pre-line">
                  {note.content}
                </p>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {note.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Tasks Tab */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Bài tập & Nhiệm vụ môn {course.name}</h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Nhiệm Vụ</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {courseTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{t.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
                  <span className="text-[11px] text-slate-400 mt-1 block">Hạn nộp: {t.deadline}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. AI Study Suite Tab */}
      {activeSubTab === 'ai_tools' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('quiz')}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-violet-500/50 cursor-pointer transition-all group"
            >
              <BrainCircuit className="w-6 h-6 text-violet-400 group-hover:scale-110 transition-transform mb-2" />
              <h4 className="text-sm font-bold text-white">Tạo Quiz Môn Học</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tự động tạo bài kiểm tra 10 câu hỏi trắc nghiệm bám sát giáo trình {course.name}.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('flashcards')}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <Layers className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
              <h4 className="text-sm font-bold text-white">Bộ Thẻ Flashcards</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tạo 15 flashcards định nghĩa & cú pháp then chốt để ôn thi nhanh.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('planner')}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group"
            >
              <Calendar className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform mb-2" />
              <h4 className="text-sm font-bold text-white">Lập Study Plan Ôn Thi</h4>
              <p className="text-xs text-slate-400 mt-1">
                Lập kế hoạch phân bổ thời gian ôn thi môn {course.name} theo tuần.
              </p>
            </div>
          </div>

          {/* AI Topic Explainer Box */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                Giải thích khái niệm khó trong môn {course.name} bằng AI
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Nhập bất kỳ thuật ngữ, khái niệm hay thuật toán nào bạn chưa hiểu rõ. AI sẽ giải thích theo phong cách trực quan, sinh động kèm ví dụ thực tế.
            </p>

            <form onSubmit={handleExplainTopic} className="flex gap-3">
              <input
                type="text"
                placeholder="Ví dụ: Con trỏ hàm trong C, Cây BST, Ma trận kề, Đồ thị Euler..."
                value={topicToExplain}
                onChange={(e) => setTopicToExplain(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={isExplaining}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isExplaining ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Đang phân tích...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Giải Thích Ngay</span>
                  </>
                )}
              </button>
            </form>

            {explainedContent && (
              <div className="mt-6 p-5 rounded-2xl bg-slate-950 border border-slate-800 animate-in fade-in">
                <div className="prose prose-invert prose-sm max-w-none text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {explainedContent}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
