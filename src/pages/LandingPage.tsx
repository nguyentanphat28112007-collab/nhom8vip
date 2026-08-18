import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  Bot,
  FolderSync,
  FileText,
  CalendarClock,
  BrainCircuit,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useApp();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard'); // allows direct guest exploration
    }
  };

  const handleTryAssistant = () => {
    setActiveTab('assistant');
  };

  return (
    <div id="landing-page" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Landing Navigation Header */}
      <header className="sticky top-0 z-40 h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-white tracking-tight">AI Study Assistant</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Sinh viên & Tự học
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTryAssistant}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>Hỏi thử AI Assistant</span>
          </button>

          <button
            onClick={handleGetStarted}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
          >
            Vào Dashboard Học Tập &rarr;
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-16 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center overflow-hidden">
          {/* Subtle Glow Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Nền tảng học tập thông minh thế hệ mới dành cho sinh viên đại học</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
            AI Study Assistant
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-violet-400 mt-2">
              Your Intelligent Companion for Better Learning.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-relaxed">
            Một nền tảng học tập thông minh giúp bạn quản lý tài liệu, môn học, lịch học, công việc và sử dụng AI để học tập, làm quiz, tạo flashcard và ôn thi hiệu quả hơn gấp 3 lần.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              id="hero-get-started-btn"
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Get Started (Bắt đầu ngay)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-try-ai-btn"
              onClick={handleTryAssistant}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Bot className="w-5 h-5 text-indigo-400" />
              <span>Try AI Assistant (Trải nghiệm AI)</span>
            </button>
          </div>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">100%</span>
              <p className="text-xs text-slate-400 mt-1">Tích hợp All-in-one</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-400">&lt; 3s</span>
              <p className="text-xs text-slate-400 mt-1">AI Tóm tắt & Phân tích</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">+35%</span>
              <p className="text-xs text-slate-400 mt-1">Cải thiện điểm số GPA</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">24/7</span>
              <p className="text-xs text-slate-400 mt-1">Gia sư AI Đồng hành</p>
            </div>
          </div>
        </section>

        {/* 6 Key Modules Showcase */}
        <section className="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tất cả công cụ bạn cần trên một nền tảng duy nhất
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Không còn phải chuyển đổi qua lại giữa Drive, Notion, Google Calendar, ChatGPT hay các app to-do rời rạc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Smart Documents */}
            <div
              onClick={() => setActiveTab('documents')}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <FolderSync className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                📚 Smart Documents
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Tải lên slide PDF, DOCX, PPTX. AI tự động đọc hiểu, tóm tắt, rút trích ý chính (Key Points) và giải thích cặn kẽ cho sinh viên.
              </p>
            </div>

            {/* 2. AI Assistant */}
            <div
              onClick={() => setActiveTab('assistant')}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">
                🤖 AI Assistant
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Chatbot gia sư cá nhân hóa theo từng môn học. Giải bài tập từng bước, giải thích trực quan bằng ẩn dụ gần gũi và lưu lịch sử hội thoại.
              </p>
            </div>

            {/* 3. Smart Notes */}
            <div
              onClick={() => setActiveTab('notes')}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                📝 Smart Notes
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hệ thống ghi chú học thuật có gắn thẻ (#tree, #pointer, #exam), liên kết trực tiếp với môn học và nút "Hỏi AI về ghi chú này".
              </p>
            </div>

            {/* 4. Study Planner */}
            <div
              onClick={() => setActiveTab('planner')}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                📅 Study Planner & Calendar
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Nhập ngày thi & mục tiêu điểm, AI tự động thiết lập lộ trình ôn tập hàng tuần và đồng bộ trực tiếp vào lịch học của bạn.
              </p>
            </div>

            {/* 5. AI Quiz Generator */}
            <div
              onClick={() => setActiveTab('quiz')}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                🧠 AI Quiz & Flashcards
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Tạo đề thi thử trắc nghiệm trích xuất từ tài liệu, bấm giờ thi thật, chấm điểm tức thì và giải thích cặn kẽ tại sao đúng/sai.
              </p>
            </div>

            {/* 6. Learning Analytics */}
            <div
              onClick={() => setActiveTab('analytics')}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition-all cursor-pointer group shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                📊 Learning Analytics & Grades
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                AI phân tích tiến độ, cảnh báo môn học cần thêm thời gian ôn luyện, tự động tính điểm GPA và đề xuất chiến lược bứt phá.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works 4 Steps */}
        <section className="py-16 px-6 lg:px-12 bg-slate-900/50 border-y border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Quy trình đơn giản
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Cách AI Study Assistant Hoạt Động
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <span className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-extrabold text-base flex items-center justify-center mb-4">
                  1
                </span>
                <h4 className="text-base font-bold text-white">Add your courses</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Tạo các môn học của kỳ học (Lập trình C, Cấu trúc dữ liệu, Toán rời rạc,...).
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <span className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-extrabold text-base flex items-center justify-center mb-4">
                  2
                </span>
                <h4 className="text-base font-bold text-white">Upload your materials</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Tải lên slide bài giảng, đề thi mẫu, giáo trình hoặc ghi chú của bạn.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <span className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-extrabold text-base flex items-center justify-center mb-4">
                  3
                </span>
                <h4 className="text-base font-bold text-white">Let AI analyze content</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  AI tóm tắt, giải thích dễ hiểu, tạo bộ Quiz trắc nghiệm và Flashcards ôn thi.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative">
                <span className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 font-extrabold text-base flex items-center justify-center mb-4">
                  4
                </span>
                <h4 className="text-base font-bold text-white">Study smarter</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Thi thử, nhận phân tích kết quả và theo dõi thời gian biểu trên Calendar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-violet-950 border border-indigo-500/40 shadow-2xl relative overflow-hidden">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Sẵn sàng nâng tầm kết quả học tập của bạn?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-3">
              Trải nghiệm ngay toàn bộ hệ thống quản lý học tập thông minh tích hợp AI miễn phí hôm nay.
            </p>
            <button
              onClick={handleGetStarted}
              className="mt-8 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/40 transition-all hover:scale-105"
            >
              Bắt đầu học thông minh hơn &rarr;
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-400">
        <p>© 2026 AI Study Assistant. Nền tảng hỗ trợ học tập thông minh toàn diện dành cho sinh viên.</p>
      </footer>
    </div>
  );
};
