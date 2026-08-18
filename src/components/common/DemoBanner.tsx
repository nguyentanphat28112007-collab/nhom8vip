import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Play, CheckCircle2, ChevronRight } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { setActiveTab, setSelectedCourseId, setSelectedDocumentId, isDemoRunning, runFullDemoFlow } = useApp();

  const steps = [
    { num: 1, title: 'Upload Tài liệu', tab: 'documents', desc: 'Chọn hoặc tải slide bài giảng' },
    { num: 2, title: 'AI Phân tích', tab: 'documents', desc: 'Tóm tắt, rút trích Key Points' },
    { num: 3, title: 'Tạo Quiz & Flashcards', tab: 'quiz', desc: 'Sinh câu hỏi trắc nghiệm & thẻ ôn' },
    { num: 4, title: 'Làm Quiz & Chấm điểm', tab: 'quiz', desc: 'Thi thử & xem giải thích chi tiết' },
    { num: 5, title: 'AI Phân tích kết quả', tab: 'analytics', desc: 'Đánh giá lỗ hổng kiến thức' },
    { num: 6, title: 'Lập Study Plan', tab: 'planner', desc: 'Kế hoạch ôn thi tối ưu theo tuần' },
    { num: 7, title: 'Đồng bộ Calendar', tab: 'calendar', desc: 'Hiện thời gian biểu học tập' },
  ];

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex === 0 || stepIndex === 1) {
      setSelectedDocumentId('doc_2');
      setActiveTab('document_detail');
    } else if (stepIndex === 2 || stepIndex === 3) {
      setActiveTab('quiz');
    } else if (stepIndex === 4) {
      setActiveTab('analytics');
    } else if (stepIndex === 5) {
      setActiveTab('planner');
    } else if (stepIndex === 6) {
      setActiveTab('calendar');
    }
  };

  return (
    <div
      id="core-demo-banner"
      className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-violet-950/70 border border-indigo-500/30 shadow-xl relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              TRẢI NGHIỆM HỌC TẬP KHÉP KÍN
            </span>
            <span className="text-xs text-slate-400 font-medium">Chu trình AI khép kín</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            Luồng Học Tập Toàn Diện với AI Study Assistant
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Từ tài liệu thô ban đầu đến kế hoạch ôn thi hoàn chỉnh trên Calendar chỉ trong 1 nền tảng duy nhất.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={runFullDemoFlow}
            disabled={isDemoRunning}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isDemoRunning ? 'Đang thực hiện demo...' : 'Chạy tự động chu trình'}</span>
          </button>
        </div>
      </div>

      {/* Step Process Line */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {steps.map((s, idx) => (
          <div
            key={s.num}
            onClick={() => handleStepClick(idx)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-indigo-900/30 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 text-[10px] font-bold flex items-center justify-center border border-indigo-500/40 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {s.num}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
            </div>
            <p className="text-[11px] font-bold text-white truncate">{s.title}</p>
            <span className="text-[10px] text-slate-400 truncate mt-0.5">{s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
