import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  User,
  MapPin,
  Award,
  Sparkles,
  Search,
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, setActiveTab, setSelectedCourseId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [room, setRoom] = useState('');
  const [credits, setCredits] = useState(3);
  const [color, setColor] = useState('#6366f1');
  const [description, setDescription] = useState('');
  const [term, setTerm] = useState('Học kỳ 1 (2026-2027)');

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lecturer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setName('');
    setCode('');
    setLecturer('');
    setRoom('');
    setCredits(3);
    setColor('#3b82f6');
    setDescription('');
    setTerm('Học kỳ 1 (2026-2027)');
    setEditingCourse(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (crs: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCourse(crs);
    setName(crs.name);
    setCode(crs.code);
    setLecturer(crs.lecturer);
    setRoom(crs.room);
    setCredits(crs.credits);
    setColor(crs.color);
    setDescription(crs.description);
    setTerm(crs.term);
    setShowAddModal(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa môn học này không?')) {
      deleteCourse(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        name,
        code,
        lecturer,
        room,
        credits: Number(credits),
        color,
        description,
        term,
      });
    } else {
      addCourse({
        name,
        code,
        lecturer,
        room,
        credits: Number(credits),
        color,
        description,
        term,
      });
    }
    setShowAddModal(false);
  };

  const handleViewCourse = (crsId: string) => {
    setSelectedCourseId(crsId);
    setActiveTab('course_detail');
  };

  return (
    <div id="courses-page" className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Quản Lý Môn Học (My Courses)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi tiến độ, tài liệu học tập, ghi chú và các công cụ AI cho từng học phần.
          </p>
        </div>

        <button
          id="add-course-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Môn Học Mới</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên môn, mã học phần, giảng viên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-hidden text-xs sm:text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
          >
            Xóa
          </button>
        )}
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredCourses.map((crs) => (
          <div
            key={crs.id}
            id={`course-card-${crs.id}`}
            onClick={() => handleViewCourse(crs.id)}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group flex flex-col justify-between"
          >
            {/* Color Accent Pill */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: crs.color || '#6366f1' }}
            />

            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700">
                    {crs.code}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                    {crs.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => handleOpenEdit(crs, e)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Chỉnh sửa môn học"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(crs.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Xóa môn học"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {crs.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{crs.lecturer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{crs.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  <span>{crs.credits} Tín chỉ</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span>Điểm TB: {crs.averageGrade}/10</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mt-5 pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                <span className="text-slate-400">Tiến độ hoàn thành</span>
                <span className="font-bold text-white">{crs.progress}%</span>
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

              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Xem chi tiết môn học</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-slate-400">{crs.term}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              {editingCourse ? 'Chỉnh Sửa Môn Học' : 'Thêm Môn Học Mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Môn Học *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lập trình C, Cấu trúc Dữ liệu..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mã Học Phần *</label>
                  <input
                    type="text"
                    required
                    placeholder="CSC101, MTH104..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Số Tín Chỉ</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Giảng Viên</label>
                  <input
                    type="text"
                    placeholder="TS. Trần Văn Nam"
                    value={lecturer}
                    onChange={(e) => setLecturer(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phòng Học</label>
                  <input
                    type="text"
                    placeholder="B2.04 - CS1"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Màu Chủ Đạo</label>
                <div className="flex items-center gap-3">
                  {['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        color === c ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Học Phần</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung trọng tâm môn học..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                >
                  {editingCourse ? 'Lưu Thay Đổi' : 'Tạo Môn Học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
