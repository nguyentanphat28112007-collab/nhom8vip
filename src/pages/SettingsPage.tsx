import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  Settings as SettingsIcon,
  Sparkles,
  Bot,
  Globe,
  Moon,
  Bell,
  Download,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Camera,
  User,
} from 'lucide-react';
import { AvatarSelectorModal } from '../components/common/AvatarSelectorModal';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const {
    courses,
    documents,
    notes,
    tasks,
    scheduleEvents,
    courseGrades,
    flashcardDecks,
    studyPlans,
    quizAttempts,
    addToast,
  } = useApp();

  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [enableNotifs, setEnableNotifs] = useState(true);
  const [enableStreakAlerts, setEnableStreakAlerts] = useState(true);
  const [autoSummary, setAutoSummary] = useState(true);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleSaveAvatar = (newAvatarUrl: string) => {
    updateUser({
      avatar: newAvatarUrl,
    });
    addToast({
      type: 'success',
      title: 'Đã cập nhật ảnh đại diện mới!',
      message: 'Ảnh đại diện được áp dụng trên tất cả màn hình.',
    });
  };

  const handleExportData = () => {
    const data = {
      user,
      courses,
      documents,
      notes,
      tasks,
      scheduleEvents,
      courseGrades,
      flashcardDecks,
      studyPlans,
      quizAttempts,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Study_Assistant_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addToast({
      type: 'success',
      title: 'Đã xuất dữ liệu sao lưu thành công!',
      message: 'File JSON đã được tải về máy của bạn.',
    });
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mẫu ban đầu không?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div id="settings-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>Cài đặt hệ thống & Tùy chọn</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Preferences & System Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tùy chỉnh thông số AI, giao diện, thông báo nhắc nhở và quản lý dữ liệu sao lưu.
          </p>
        </div>
      </div>

      {/* AI Engine Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Mô hình AI Gemini</h3>
              <p className="text-xs text-slate-400">Gemini 3.7 Flash • Server-side API</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sẵn sàng hoạt động</span>
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          Hệ thống AI xử lý toàn bộ tác vụ tóm tắt bài giảng, sinh quiz trắc nghiệm, tạo flashcard và lập kế hoạch ôn thi tự động thông qua giao thức bảo mật phía máy chủ (Server-side proxy).
        </p>
      </div>

      {/* Student Profile & Avatar Customization */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt="Avatar"
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg bg-slate-950 group-hover:ring-indigo-500 transition-all"
            />
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white"
              title="Đổi ảnh đại diện"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">{user?.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {user?.university}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.major} • {user?.year}</p>
            <p className="text-xs text-emerald-400 font-semibold mt-1">Mục tiêu GPA: {user?.gpaTarget}/4.0</p>
          </div>
        </div>

        <button
          onClick={() => setIsAvatarModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Camera className="w-4 h-4" />
          <span>Thay đổi Avatar</span>
        </button>
      </div>

      {/* General Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language & Interface */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Ngôn ngữ & Giao diện</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Ngôn ngữ hiển thị</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'vi' | 'en')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
              >
                <option value="vi">Tiếng Việt (Mặc định)</option>
                <option value="en">English (US)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <div>
                <span className="text-xs font-semibold text-white">Chế độ tối (Dark Mode)</span>
                <p className="text-[11px] text-slate-400">Giao diện tối chuyên nghiệp cho sinh viên</p>
              </div>
              <span className="text-xs font-bold text-indigo-400">Bật</span>
            </div>
          </div>
        </div>

        {/* Notifications & Study Automation */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>Thông báo & Tự động hóa</span>
          </h3>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white">Nhắc nhở chuỗi học tập (Streak)</span>
                <p className="text-[11px] text-slate-400">Thông báo vào 20:00 hằng ngày</p>
              </div>
              <input
                type="checkbox"
                checked={enableStreakAlerts}
                onChange={(e) => setEnableStreakAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white">Tự động tóm tắt khi tải tài liệu mới</span>
                <p className="text-[11px] text-slate-400">Tự động gọi AI tạo Summary khi nộp file</p>
              </div>
              <input
                type="checkbox"
                checked={autoSummary}
                onChange={(e) => setAutoSummary(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-extrabold text-sm text-white">Quản lý Dữ liệu & Sao lưu</h3>
        <p className="text-xs text-slate-400">
          Toàn bộ tài liệu, câu hỏi trắc nghiệm, điểm số và flashcard được lưu trữ an toàn trong trình duyệt của bạn.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất toàn bộ dữ liệu (Export JSON)</span>
          </button>

          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Khôi phục dữ liệu gốc</span>
          </button>
        </div>
      </div>

      {/* Avatar Modal */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={user?.avatar || ''}
        onSaveAvatar={handleSaveAvatar}
      />
    </div>
  );
};
