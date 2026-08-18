import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  Award,
  Flame,
  Clock,
  Target,
  Edit2,
  Save,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Layers,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { AvatarSelectorModal } from '../components/common/AvatarSelectorModal';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { courses, flashcardDecks, quizAttempts, tasks, addToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || 'Nguyễn Tấn Phát');
  const [university, setUniversity] = useState(user?.university || 'Đại học Quốc gia TP.HCM');
  const [major, setMajor] = useState(user?.major || 'Khoa học Máy tính');
  const [year, setYear] = useState(user?.year || 'Sinh viên Năm 2');
  const [studyGoals, setStudyGoals] = useState(
    user?.studyGoals || 'Đạt GPA 3.8/4.0, thành thạo Cấu trúc Dữ liệu & Giải thuật và hoàn thành đề tài NCKH.'
  );
  const [gpaTarget, setGpaTarget] = useState(user?.gpaTarget || 3.8);

  const handleSaveAvatar = (newAvatarUrl: string) => {
    updateUser({
      avatar: newAvatarUrl,
    });
    addToast({
      type: 'success',
      title: 'Đã đổi ảnh đại diện thành công!',
      message: 'Ảnh đại diện mới đã được lưu và cập nhật trên toàn hệ thống.',
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      university,
      major,
      year,
      studyGoals,
      gpaTarget,
    });
    setIsEditing(false);
    addToast({
      type: 'success',
      title: 'Đã cập nhật hồ sơ cá nhân!',
    });
  };

  const badges = [
    { title: 'Chăm chỉ vô đối', desc: 'Duy trì chuỗi học 12 ngày liên tục', icon: <Flame className="w-5 h-5 text-amber-400 fill-amber-400" /> },
    { title: 'Quiz Master', desc: 'Đạt điểm tuyệt đối 10/10 ở 3 bài quiz', icon: <Award className="w-5 h-5 text-indigo-400" /> },
    { title: 'Thần tài Flashcard', desc: 'Ôn tập hơn 50 thẻ ghi nhớ', icon: <Layers className="w-5 h-5 text-emerald-400" /> },
    { title: 'Kỷ luật Thép', desc: 'Hoàn thành 100% nhiệm vụ trước hạn', icon: <CheckCircle2 className="w-5 h-5 text-cyan-400" /> },
  ];

  return (
    <div id="profile-page" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {/* Avatar with Click to Change and Hover Badge */}
          <div className="relative group shrink-0">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt="Avatar"
              referrerPolicy="no-referrer"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/30 shadow-2xl bg-slate-900 transition-all duration-300 group-hover:ring-indigo-500 group-hover:brightness-75"
            />
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer text-white"
              title="Nhấp để đổi ảnh đại diện"
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">Đổi ảnh</span>
            </button>

            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute -bottom-1 -right-1 p-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg ring-2 ring-slate-950 transition-transform active:scale-95 cursor-pointer sm:hidden"
              title="Đổi ảnh đại diện"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sinh viên Pro
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {user?.major} • {user?.university}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.year}</p>

            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700/80 text-slate-300 hover:text-indigo-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>Đổi ảnh đại diện</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
          <span>{isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa hồ sơ'}</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Môn đang học</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-extrabold text-white mt-1">{courses.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Chuỗi Streak</span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">{user?.streakDays || 12} ngày</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Mục tiêu GPA</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">{user?.gpaTarget || 3.6}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Giờ tự học</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1">{user?.totalStudyHours || 48}h</p>
        </div>
      </div>

      {/* Edit Form or Information Display */}
      {isEditing ? (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white">Chỉnh sửa thông tin sinh viên</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt="Avatar preview"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Ảnh đại diện tài khoản</h4>
                  <p className="text-[11px] text-slate-400">Chọn ảnh mẫu, tải từ máy hoặc tạo avatar AI</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Đổi ảnh</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Họ và tên</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Trường đại học</label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Chuyên ngành</label>
              <input
                type="text"
                required
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Năm học / Niên khóa</label>
              <input
                type="text"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mục tiêu GPA (Thang 4.0)</label>
              <input
                type="number"
                step="0.05"
                min="1.0"
                max="4.0"
                required
                value={gpaTarget}
                onChange={(e) => setGpaTarget(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mục tiêu học tập dài hạn</label>
            <textarea
              rows={3}
              value={studyGoals}
              onChange={(e) => setStudyGoals(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white">Mục tiêu & Định hướng học tập</h3>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-300 leading-relaxed">
            "{user?.studyGoals}"
          </div>
        </div>
      )}

      {/* Badges and Achievements */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-extrabold text-base text-white">Huy hiệu & Thành tích Đạt được</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
            >
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                {b.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{b.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar Selection & Customization Modal */}
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={user?.avatar || ''}
        onSaveAvatar={handleSaveAvatar}
      />
    </div>
  );
};
