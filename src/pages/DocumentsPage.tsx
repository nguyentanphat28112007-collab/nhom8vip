import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DocumentItem } from '../types';
import {
  FolderSync,
  Upload,
  Plus,
  Search,
  FileText,
  Sparkles,
  Trash2,
  Filter,
  Eye,
  BrainCircuit,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const {
    documents,
    courses,
    addDocument,
    deleteDocument,
    setActiveTab,
    setSelectedDocumentId,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form states
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'pptx' | 'txt'>('pdf');
  const [tagsInput, setTagsInput] = useState('');
  const [content, setContent] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = selectedCourseFilter === 'all' || doc.courseId === selectedCourseFilter;
    return matchesSearch && matchesCourse;
  });

  const handleOpenUpload = () => {
    setTitle('');
    setCourseId(courses[0]?.id || '');
    setFileType('pdf');
    setTagsInput('#bai_giang, #ly_thuyet');
    setContent('');
    setShowUploadModal(true);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'docx' || ext === 'pptx' || ext === 'txt') {
        setFileType(ext as any);
      }
      setContent(
        `Nội dung trích xuất từ tập tin ${file.name} (${(file.size / 1024).toFixed(1)} KB):\n\nTài liệu học thuật chuyên sâu bao gồm các định nghĩa, sơ đồ thuật toán, cấu trúc dữ liệu, nguyên lý hoạt động và các ví dụ thực hành tiêu biểu dành cho sinh viên.`
      );
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'docx' || ext === 'pptx' || ext === 'txt') {
        setFileType(ext as any);
      }
      setContent(
        `Nội dung tài liệu ${file.name} (${(file.size / 1024).toFixed(1)} KB):\n\nCác khái niệm trọng tâm, ví dụ code mẫu và câu hỏi ôn tập cuối chương dành cho kỳ thi.`
      );
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const matchedCourse = courses.find((c) => c.id === courseId);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newDocId = addDocument({
      title,
      courseId,
      courseName: matchedCourse ? matchedCourse.name : 'Chung',
      fileType: fileType,
      fileSize: '1.8 MB',
      tags: tags.length > 0 ? tags : ['#tai_lieu', '#hoc_tap'],
      content:
        content ||
        `Tài liệu tóm tắt học phần ${matchedCourse?.name || 'môn học'}. Bao gồm định nghĩa, kiến thức trọng tâm và các dạng bài tập thực hành.`,
    });

    setShowUploadModal(false);
    setSelectedDocumentId(newDocId);
    setActiveTab('document_detail');
  };

  const handleOpenDetail = (docId: string) => {
    setSelectedDocumentId(docId);
    setActiveTab('document_detail');
  };

  return (
    <div id="documents-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              BƯỚC 1 & 2 TRONG LUỒNG DEMO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Quản Lý Tài Liệu (Documents)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Lưu trữ slide bài giảng, giáo trình PDF và sử dụng AI để tóm tắt, tạo câu hỏi trắc nghiệm tự động.
          </p>
        </div>

        <button
          id="upload-doc-btn"
          onClick={handleOpenUpload}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Tài Liệu Mới</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2 flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu theo tên, thẻ tag, môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-hidden text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-hidden"
          >
            <option value="all">Tất cả môn học ({documents.length})</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            id={`doc-card-${doc.id}`}
            onClick={() => handleOpenDetail(doc.id)}
            className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-mono text-xs font-bold uppercase">
                    {doc.fileType}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-400">{doc.courseName}</span>
                    <p className="text-[10px] text-slate-400">{doc.fileSize} • {doc.uploadDate}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Xóa tài liệu này?')) deleteDocument(doc.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Xóa tài liệu"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-white mt-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
                {doc.title}
              </h3>

              <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {doc.content}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mt-4">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick AI Action Bottom Bar */}
            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenDetail(doc.id);
                }}
                className="text-xs text-indigo-400 group-hover:text-indigo-300 font-bold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Phân Tích & Quiz</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <span className="text-[10px] text-slate-400">Xem chi tiết</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Tải Lên Tài Liệu Mới</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`p-6 rounded-2xl border-2 border-dashed text-center transition-colors cursor-pointer ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-950/20'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-white">
                  Kéo thả file vào đây, hoặc click để chọn tập tin từ máy tính
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ PDF, DOCX, PPTX, TXT (Tối đa 25MB)</p>

                <input
                  type="file"
                  id="file-upload-input"
                  accept=".pdf,.docx,.pptx,.txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload-input"
                  className="inline-block mt-3 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 cursor-pointer"
                >
                  Chọn tập tin
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tiêu Đề Tài Liệu *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Slide Chương 4 - Cây nhị phân tìm kiếm BST..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Môn Học *</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Loại Tập Tin</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="docx">Word DOCX</option>
                    <option value="pptx">PowerPoint PPTX</option>
                    <option value="txt">Text File (TXT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thẻ Ghi Nhớ (Tags)</label>
                <input
                  type="text"
                  placeholder="#cây_nhị_phân, #giữa_kỳ, #dsa..."
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nội dung trích xuất / Ghi chú</label>
                <textarea
                  rows={4}
                  placeholder="Dán nội dung tóm tắt hoặc văn bản tài liệu tại đây..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Lưu & Phân Tích AI</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
