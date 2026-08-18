import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduleEvent, EventType } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Sparkles,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Trash2,
  CalendarDays,
  Layers,
  Filter,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const {
    scheduleEvents,
    courses,
    addScheduleEvent,
    deleteScheduleEvent,
    setActiveTab,
    studyPlans,
    syncPlanToCalendar,
    addToast,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date('2026-08-17'));
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('class');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [date, setDate] = useState('2026-08-18');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('Phòng A1-402');
  const [notes, setNotes] = useState('');

  // Month navigation
  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const todayAction = () => {
    setCurrentDate(new Date('2026-08-17'));
  };

  // Filter events
  const filteredEvents = scheduleEvents.filter((ev) => {
    const matchesType = filterType === 'all' || ev.type === filterType;
    const matchesCourse = selectedCourseFilter === 'all' || ev.courseId === selectedCourseFilter || (ev.courseName && ev.courseName.includes(selectedCourseFilter));
    return matchesType && matchesCourse;
  });

  // Upcoming Exams
  const upcomingExams = scheduleEvents
    .filter((e) => e.type === 'exam')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Generate calendar grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert to Monday-start (0 = Mon, ..., 6 = Sun)
  const startingDay = (firstDayIndex + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Blank days from previous month
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push({ day: null, dateStr: '' });
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(d).padStart(2, '0');
    const fullDate = `${year}-${monthStr}-${dayStr}`;
    calendarDays.push({ day: d, dateStr: fullDate });
  }

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCourse = courses.find((c) => c.id === courseId);
    addScheduleEvent({
      title,
      type: eventType,
      courseId: courseId || undefined,
      courseName: matchedCourse ? matchedCourse.name : undefined,
      date,
      startTime,
      endTime,
      location,
      notes,
    });

    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  const getEventBadgeClass = (type: EventType) => {
    switch (type) {
      case 'exam':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'deadline':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'study_session':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/40';
      case 'class':
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'exam':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
      case 'deadline':
        return <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case 'study_session':
        return <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    }
  };

  return (
    <div id="calendar-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>Lịch học & Thời khóa biểu thông minh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Study Schedule & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý lịch học, lịch thi, hạn nộp đồ án và tự động đồng bộ kế hoạch ôn thi từ AI Study Planner.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sự kiện mới</span>
          </button>
        </div>
      </div>

      {/* AI Exam Warning & Quick Sync Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Exam Alert Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Lịch thi sắp tới</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                {upcomingExams.length} kỳ thi
              </span>
            </div>
            {upcomingExams.length > 0 ? (
              <p className="text-xs text-slate-300 mt-1">
                <strong className="text-rose-300">{upcomingExams[0].title}</strong> vào ngày {upcomingExams[0].date} ({upcomingExams[0].startTime}).
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1">Chưa có lịch thi nào được ghi nhận.</p>
            )}
          </div>
        </div>

        {/* Sync from AI Study Plan */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 flex items-start gap-3 md:col-span-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-white">Đồng bộ Kế hoạch Ôn thi AI</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Bạn có {studyPlans.length} kế hoạch học tập AI. Đồng bộ các phiên học vào lịch để nhận thông báo nhắc nhở.
              </p>
            </div>
            {studyPlans.length > 0 && (
              <button
                onClick={() => {
                  syncPlanToCalendar(studyPlans[0].id);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold shrink-0 cursor-pointer"
              >
                Đồng bộ kế hoạch gần nhất
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Controls & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        {/* Navigation Month Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-36 text-center">
            Tháng {month + 1}, {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={todayAction}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors ml-1"
          >
            Hôm nay
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('class')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === 'class' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lớp học
            </button>
            <button
              onClick={() => setFilterType('exam')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === 'exam' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lịch thi
            </button>
            <button
              onClick={() => setFilterType('deadline')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === 'deadline' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hạn nộp
            </button>
            <button
              onClick={() => setFilterType('study_session')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === 'study_session' ? 'bg-violet-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tự học AI
            </button>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-2.5 py-1 rounded-lg ${
                viewMode === 'month' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Tháng
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-lg ${
                viewMode === 'list' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Danh sách
            </button>
          </div>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'month' ? (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
          {/* Weekday Headers (Mon - Sun) */}
          <div className="grid grid-cols-7 bg-slate-950/80 border-b border-slate-800 text-center py-3 text-xs font-bold text-slate-400">
            <div>Thứ Hai</div>
            <div>Thứ Ba</div>
            <div>Thứ Tư</div>
            <div>Thứ Năm</div>
            <div>Thứ Sáu</div>
            <div className="text-indigo-400">Thứ Bảy</div>
            <div className="text-rose-400">Chủ Nhật</div>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 auto-rows-fr gap-px bg-slate-800/50">
            {calendarDays.map((cell, idx) => {
              if (!cell.day) {
                return <div key={`empty_${idx}`} className="min-h-28 bg-slate-950/40 p-2" />;
              }

              const isToday = cell.dateStr === '2026-08-17';
              const daysEvents = filteredEvents.filter((e) => e.date === cell.dateStr);

              return (
                <div
                  key={cell.dateStr}
                  className={`min-h-28 bg-slate-900/90 p-2 transition-colors hover:bg-slate-850 flex flex-col justify-between border-t border-slate-800/40 ${
                    isToday ? 'ring-1 ring-inset ring-indigo-500 bg-indigo-950/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday ? 'bg-indigo-600 text-white font-extrabold' : 'text-slate-400'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {daysEvents.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-semibold">{daysEvents.length} sự kiện</span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-20 custom-scrollbar">
                    {daysEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => {
                          addToast({
                            type: 'info',
                            title: ev.title,
                            message: `${ev.startTime} - ${ev.endTime} | ${ev.location || 'Online'}`,
                          });
                        }}
                        className={`p-1.5 rounded-lg border text-[11px] font-medium leading-tight cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-1.5 ${getEventBadgeClass(
                          ev.type
                        )}`}
                        title={`${ev.title} (${ev.startTime} - ${ev.endTime})`}
                      >
                        {getEventIcon(ev.type)}
                        <span className="truncate">{ev.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-300">Không tìm thấy sự kiện nào phù hợp.</p>
            </div>
          ) : (
            filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-4 transition-colors hover:border-slate-700"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 shrink-0">
                    {getEventIcon(ev.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{ev.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getEventBadgeClass(
                          ev.type
                        )}`}
                      >
                        {ev.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        {ev.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {ev.startTime} - {ev.endTime}
                      </span>
                      {ev.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {ev.location}
                        </span>
                      )}
                      {ev.courseName && (
                        <span className="flex items-center gap-1 text-indigo-300">
                          <BookOpen className="w-3.5 h-3.5" />
                          {ev.courseName}
                        </span>
                      )}
                    </div>
                    {ev.notes && <p className="text-xs text-slate-400 mt-2 bg-slate-950 p-2 rounded-lg">{ev.notes}</p>}
                  </div>
                </div>

                <button
                  onClick={() => deleteScheduleEvent(ev.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Xóa sự kiện"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">Thêm sự kiện / Lịch học mới</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên sự kiện / Lớp học *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tiết học Cấu trúc dữ liệu & giải thuật"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Loại sự kiện</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  >
                    <option value="class">Tiết học trên lớp</option>
                    <option value="exam">Lịch thi học kỳ</option>
                    <option value="deadline">Hạn nộp bài tập</option>
                    <option value="study_session">Buổi tự học / Luyện đề</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Môn học liên quan</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  >
                    <option value="">-- Không liên kết --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ngày (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Bắt đầu</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kết thúc</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Địa điểm / Phòng học / Link</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giảng đường B2-301 hoặc MS Teams"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ghi chú thêm</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú bài tập hoặc tài liệu cần mang theo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Lưu vào lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
