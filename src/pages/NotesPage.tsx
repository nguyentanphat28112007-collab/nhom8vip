import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Sparkles,
  Trash2,
  Edit2,
  Bot,
  Tag,
  BookOpen,
  Filter,
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { notes, courses, addNote, updateNote, deleteNote, setActiveTab, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // All unique tags
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCourse = selectedCourseFilter === 'all' || n.courseId === selectedCourseFilter;
    const matchesTag = selectedTagFilter === 'all' || n.tags.includes(selectedTagFilter);
    return matchesSearch && matchesCourse && matchesTag;
  });

  const handleOpenAdd = () => {
    setTitle('');
    setCourseId(courses[0]?.id || '');
    setContent('');
    setTagsInput('#ghi_chu, #hoc_phan');
    setIsPinned(false);
    setEditingNote(null);
    setShowModal(true);
  };

  const handleOpenEdit = (n: NoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNote(n);
    setTitle(n.title);
    setCourseId(n.courseId || courses[0]?.id || '');
    setContent(n.content);
    setTagsInput(n.tags.join(', '));
    setIsPinned(n.isPinned);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const matchedCourse = courses.find((c) => c.id === courseId);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingNote) {
      updateNote(editingNote.id, {
        title,
        courseId,
        courseName: matchedCourse ? matchedCourse.name : 'Chung',
        content,
        tags,
        isPinned,
      });
    } else {
      addNote({
        title,
        courseId,
        courseName: matchedCourse ? matchedCourse.name : 'Chung',
        content,
        tags,
        isPinned,
      });
    }
    setShowModal(false);
  };

  const handleAskAiAboutNote = (note: NoteItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab('assistant');
  };

  return (
    <div id="notes-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ghi Chú Thông Minh (Smart Notes)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ghi chép bài giảng theo cấu trúc, gắn thẻ môn học và hỏi đáp giải thích với AI.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Ghi Chú Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung ghi chú, thẻ tag (#pointer, #tree)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-hidden text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap">
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-hidden"
          >
            <option value="all">Tất cả môn học</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-hidden"
          >
            <option value="all">Tất cả thẻ tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={(e) => handleOpenEdit(note, e)}
            className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group flex flex-col justify-between ${
              note.isPinned
                ? 'bg-slate-900 border-cyan-500/50 shadow-cyan-950/20'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {note.courseName || 'Ghi chú chung'}
                  </span>
                  {note.isPinned && (
                    <span className="p-1 text-cyan-400" title="Đã ghim">
                      <Pin className="w-3.5 h-3.5 fill-cyan-400" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNote(note.id, { isPinned: !note.isPinned });
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      note.isPinned ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
                    }`}
                    title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Xóa ghi chú này?')) deleteNote(note.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                {note.title}
              </h3>

              <div className="text-xs text-slate-300 mt-2 line-clamp-4 leading-relaxed whitespace-pre-line font-mono">
                {note.content}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-4">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-cyan-300/80 border border-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={(e) => handleAskAiAboutNote(note, e)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Hỏi AI về ghi chú này</span>
              </button>

              <span className="text-[10px] text-slate-400">
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white mb-4">
              {editingNote ? 'Chỉnh Sửa Ghi Chú' : 'Tạo Ghi Chú Học Tập Mới'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tiêu Đề Ghi Chú *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lưu ý khi giải bài tập Cây BST, Công thức đạo hàm..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Thuộc Môn Học</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-hidden"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Thẻ Tags (cách nhau dấu phẩy)</label>
                  <input
                    type="text"
                    placeholder="#pointer, #exam, #dsa..."
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nội Dung Ghi Chú</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Viết nội dung bài giảng, mẹo giải bài hoặc dán code tại đây..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-500 focus:outline-hidden font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pin-checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="pin-checkbox" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Ghim ghi chú quan trọng này lên đầu
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold"
                >
                  {editingNote ? 'Lưu Thay Đổi' : 'Lưu Ghi Chú'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
