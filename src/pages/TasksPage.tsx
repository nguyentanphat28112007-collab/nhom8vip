import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskItem, TaskPriority, TaskStatus } from '../types';
import {
  CheckSquare,
  Plus,
  Clock,
  BookOpen,
  Filter,
  CheckCircle2,
  Circle,
  Clock3,
  AlertTriangle,
  Sparkles,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  ArrowRight,
  Bot,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const {
    tasks,
    courses,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    setActiveTab,
    addToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [deadline, setDeadline] = useState('2026-08-25');
  const [estimatedHours, setEstimatedHours] = useState(2);

  // AI Task Breakdown State
  const [aiBreakdownTask, setAiBreakdownTask] = useState<TaskItem | null>(null);
  const [aiSubtasks, setAiSubtasks] = useState<string[]>([]);
  const [isGeneratingSubtasks, setIsGeneratingSubtasks] = useState(false);

  // Filters
  const filteredTasks = tasks.filter((t) => {
    const matchesCourse = selectedCourseFilter === 'all' || t.courseId === selectedCourseFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || t.priority === selectedPriorityFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesPriority && matchesSearch;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'To Do');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'Completed');

  const handleOpenAdd = () => {
    setTitle('');
    setDescription('');
    setCourseId(courses[0]?.id || '');
    setPriority('Medium');
    setDeadline('2026-08-25');
    setEstimatedHours(2);
    setEditingTask(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (t: TaskItem) => {
    setEditingTask(t);
    setTitle(t.title);
    setDescription(t.description);
    setCourseId(t.courseId);
    setPriority(t.priority);
    setDeadline(t.deadline);
    setEstimatedHours(t.estimatedHours || 2);
    setShowAddModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCourse = courses.find((c) => c.id === courseId);
    const courseName = matchedCourse ? matchedCourse.name : 'Môn học chung';

    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        description,
        courseId,
        courseName,
        priority,
        deadline,
        estimatedHours,
      });
      addToast({ type: 'success', title: 'Đã cập nhật nhiệm vụ' });
    } else {
      addTask({
        title,
        description,
        courseId,
        courseName,
        priority,
        status: 'To Do',
        deadline,
        estimatedHours,
      });
    }

    setShowAddModal(false);
  };

  // AI Task Breakdown generator
  const handleAIBreakdown = (t: TaskItem) => {
    setAiBreakdownTask(t);
    setIsGeneratingSubtasks(true);
    setTimeout(() => {
      setAiSubtasks([
        `1. Tìm và đọc tài liệu tham khảo chương tương ứng (${t.courseName})`,
        `2. Liệt kê các yêu cầu kỹ thuật & phân tích ca kiểm thử (Test cases)`,
        `3. Xây dựng bản nháp logic và code / giải thuật cốt lõi (1.5h)`,
        `4. Rà soát lỗi biên dịch, tối ưu độ phức tạp và viết báo cáo tóm tắt`,
      ]);
      setIsGeneratingSubtasks(false);
    }, 600);
  };

  const handleAddSubtasksAsTasks = () => {
    if (!aiBreakdownTask) return;
    aiSubtasks.forEach((sub, idx) => {
      addTask({
        title: `[${aiBreakdownTask.title.slice(0, 15)}...] ${sub}`,
        description: `Subtask được chia nhỏ tự động bởi AI từ bài tập: ${aiBreakdownTask.title}`,
        courseId: aiBreakdownTask.courseId,
        courseName: aiBreakdownTask.courseName,
        priority: 'Medium',
        status: 'To Do',
        deadline: aiBreakdownTask.deadline,
        estimatedHours: 1,
      });
    });
    setAiBreakdownTask(null);
    setAiSubtasks([]);
    addToast({
      type: 'success',
      title: 'Đã tạo 4 nhiệm vụ con từ AI! 🎯',
      message: 'Các subtasks đã được thêm vào danh sách To-Do của bạn.',
    });
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'High':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Low':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div id="tasks-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Nhiệm vụ học tập & Deadline Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Assignments & Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi tiến độ bài tập lớn, đồ án môn học, lab thực hành với tính năng AI hỗ trợ chia nhỏ nhiệm vụ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo nhiệm vụ mới</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Tổng nhiệm vụ</span>
          <p className="text-2xl font-extrabold text-white mt-1">{tasks.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-amber-400 font-medium">Cần làm (To Do)</span>
          <p className="text-2xl font-extrabold text-amber-400 mt-1">
            {tasks.filter((t) => t.status === 'To Do').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-indigo-400 font-medium">Đang thực hiện</span>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1">
            {tasks.filter((t) => t.status === 'In Progress').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-emerald-400 font-medium">Đã hoàn thành</span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1">
            {tasks.filter((t) => t.status === 'Completed').length}
          </p>
        </div>
      </div>

      {/* Filter & View Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* Course filter */}
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-hidden"
          >
            <option value="all">Tất cả môn học</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-hidden"
          >
            <option value="all">Tất cả mức ưu tiên</option>
            <option value="High">Ưu tiên cao (High)</option>
            <option value="Medium">Trung bình (Medium)</option>
            <option value="Low">Thấp (Low)</option>
          </select>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs self-start md:self-auto">
          <button
            onClick={() => setViewMode('board')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'board' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Danh sách List
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column: To Do */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs text-white uppercase tracking-wider">Chưa làm (To Do)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300">
                {todoTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {todoTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onStatusChange={updateTaskStatus}
                  onEdit={handleOpenEdit}
                  onDelete={deleteTask}
                  onBreakdown={handleAIBreakdown}
                />
              ))}
              {todoTasks.length === 0 && (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
                  Không có nhiệm vụ nào đang chờ.
                </div>
              )}
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <Clock3 className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs text-white uppercase tracking-wider">Đang làm (In Progress)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300">
                {inProgressTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {inProgressTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onStatusChange={updateTaskStatus}
                  onEdit={handleOpenEdit}
                  onDelete={deleteTask}
                  onBreakdown={handleAIBreakdown}
                />
              ))}
              {inProgressTasks.length === 0 && (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
                  Chưa có nhiệm vụ nào đang thực hiện.
                </div>
              )}
            </div>
          </div>

          {/* Column: Completed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white uppercase tracking-wider">Đã xong (Completed)</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300">
                {completedTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {completedTasks.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onStatusChange={updateTaskStatus}
                  onEdit={handleOpenEdit}
                  onDelete={deleteTask}
                  onBreakdown={handleAIBreakdown}
                />
              ))}
              {completedTasks.length === 0 && (
                <div className="p-8 text-center rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
                  Chưa có nhiệm vụ nào hoàn thành.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4 transition-colors hover:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateTaskStatus(t.id, t.status === 'Completed' ? 'To Do' : 'Completed')
                  }
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                    t.status === 'Completed'
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'border-slate-700 text-transparent hover:border-slate-500'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>

                <div>
                  <h4
                    className={`text-sm font-bold ${
                      t.status === 'Completed' ? 'text-slate-400 line-through' : 'text-white'
                    }`}
                  >
                    {t.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="text-indigo-300">{t.courseName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Hạn: {t.deadline}
                    </span>
                    {t.estimatedHours && <span>• {t.estimatedHours}h ước tính</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                    t.priority
                  )}`}
                >
                  {t.priority}
                </span>

                <button
                  onClick={() => handleAIBreakdown(t)}
                  className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/15"
                  title="AI chia nhỏ nhiệm vụ"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Subtasks Modal */}
      {aiBreakdownTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <div>
                <h3 className="font-bold text-sm text-white">AI Task Breakdown & Gợi ý lộ trình</h3>
                <p className="text-xs text-slate-400">{aiBreakdownTask.title}</p>
              </div>
            </div>

            <div className="my-4 space-y-2.5">
              {isGeneratingSubtasks ? (
                <div className="py-8 text-center text-xs text-indigo-300">
                  <Bot className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                  <span>AI đang phân tích yêu cầu bài tập và chia nhỏ các bước thực hiện...</span>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-300 mb-2">
                    AI đã chia nhỏ nhiệm vụ này thành 4 bước dễ hoàn thành:
                  </p>
                  {aiSubtasks.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      {sub}
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setAiBreakdownTask(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                onClick={handleAddSubtasksAsTasks}
                disabled={isGeneratingSubtasks}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                Thêm 4 bước này vào To-Do
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">
                {editingTask ? 'Chỉnh sửa nhiệm vụ' : 'Thêm nhiệm vụ mới'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên nhiệm vụ / Bài tập *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàn thành Lab 4 Cấu trúc cây BST"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Môn học</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mức ưu tiên</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  >
                    <option value="High">Cao (High)</option>
                    <option value="Medium">Trung bình</option>
                    <option value="Low">Thấp (Low)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hạn nộp</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Ước tính (giờ)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô tả chi tiết</label>
                <textarea
                  rows={3}
                  placeholder="Yêu cầu nộp file zip, báo cáo word và file source code..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-hidden"
                />
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Lưu nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Task Card for Kanban
interface TaskCardProps {
  task: TaskItem;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (t: TaskItem) => void;
  onDelete: (id: string) => void;
  onBreakdown: (t: TaskItem) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onBreakdown,
}) => {
  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3 group shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            task.priority === 'High'
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : task.priority === 'Medium'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {task.priority}
        </span>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
          <button
            onClick={() => onBreakdown(task)}
            className="p-1 rounded text-indigo-400 hover:bg-indigo-500/15"
            title="AI chia nhỏ nhiệm vụ"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-1 rounded text-slate-400 hover:text-white"
            title="Sửa"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded text-slate-400 hover:text-rose-400"
            title="Xóa"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
        {task.description && (
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span className="text-indigo-300 font-medium truncate max-w-[130px]">{task.courseName}</span>
        <span className="flex items-center gap-1 text-amber-300">
          <Clock className="w-3 h-3" />
          {task.deadline}
        </span>
      </div>

      {/* Move buttons */}
      <div className="flex items-center gap-1 pt-1">
        {task.status !== 'To Do' && (
          <button
            onClick={() => onStatusChange(task.id, 'To Do')}
            className="flex-1 py-1 text-[10px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-center"
          >
            &larr; To Do
          </button>
        )}
        {task.status !== 'In Progress' && (
          <button
            onClick={() => onStatusChange(task.id, 'In Progress')}
            className="flex-1 py-1 text-[10px] rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-center border border-indigo-500/20"
          >
            Làm tiếp
          </button>
        )}
        {task.status !== 'Completed' && (
          <button
            onClick={() => onStatusChange(task.id, 'Completed')}
            className="flex-1 py-1 text-[10px] rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-center border border-emerald-500/20"
          >
            Xong ✓
          </button>
        )}
      </div>
    </div>
  );
};
