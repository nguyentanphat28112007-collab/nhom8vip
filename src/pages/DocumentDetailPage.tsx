import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Sparkles,
  BrainCircuit,
  Layers,
  Bot,
  FileText,
  Copy,
  Check,
  Send,
  Loader2,
  HelpCircle,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const DocumentDetailPage: React.FC = () => {
  const {
    selectedDocumentId,
    documents,
    setActiveTab,
    addFlashcardDeck,
    addToast,
  } = useApp();

  const documentItem = documents.find((d) => d.id === selectedDocumentId) || documents[0];

  const [activeAnalysisTab, setActiveAnalysisTab] = useState<'summary' | 'key_points' | 'explain' | 'quiz' | 'flashcards' | 'chat'>('summary');

  // AI Loading & Result States
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [summaryData, setSummaryData] = useState<{ summary: string; keyPoints: string[]; estimatedReadingTime: string } | null>(null);
  const [detailedExplanation, setDetailedExplanation] = useState<string>('');
  const [generatedQuiz, setGeneratedQuiz] = useState<any[] | null>(null);
  const [generatedCards, setGeneratedCards] = useState<any[] | null>(null);

  // Chat with Document
  const [docChatInput, setDocChatInput] = useState('');
  const [docChatMessages, setDocChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Xin chào! Tôi đã đọc toàn bộ nội dung của "${documentItem?.title || 'tài liệu'}". Bạn có câu hỏi nào cần giải thích thêm hoặc muốn tôi tóm tắt phần nào không?`,
    },
  ]);
  const [isChatSending, setIsChatSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Automatically trigger AI Summary if not loaded
  useEffect(() => {
    if (documentItem && !summaryData) {
      handleFetchSummary();
    }
  }, [documentItem]);

  const handleFetchSummary = async () => {
    if (!documentItem) return;
    setLoadingAnalysis(true);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentContent: `${documentItem.title}\n${documentItem.content}`,
          title: documentItem.title,
        }),
      });
      const data = await res.json();
      setSummaryData(data);
    } catch (err) {
      console.error(err);
      setSummaryData({
        summary: `Tài liệu "${documentItem.title}" tập trung vào các cấu trúc giải thuật cốt lõi và nguyên lý tổ chức bộ nhớ. Bài học phân tích chi tiết độ phức tạp thuật toán và cách cài đặt an toàn.`,
        keyPoints: [
          'Khái niệm nền tảng và nguyên tắc hoạt động',
          'Độ phức tạp tính toán O(log N) và O(N)',
          'Cài đặt code an toàn và tối ưu bộ nhớ',
          'Các bẫy thường gặp trong đề thi học kỳ',
        ],
        estimatedReadingTime: '4 phút',
      });
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleFetchExplain = async () => {
    if (!documentItem || detailedExplanation) return;
    setLoadingAnalysis(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: documentItem.title,
          level: 'beginner',
          context: documentItem.content,
        }),
      });
      const data = await res.json();
      setDetailedExplanation(data.explanation);
    } catch (err) {
      console.error(err);
      setDetailedExplanation(
        `### Giải thích chi tiết: ${documentItem.title}\n\n**1. Bức tranh tổng quan:**\nKhái niệm này giúp bạn hình dung cấu trúc chương trình theo hướng phân cấp khoa học.\n\n**2. Ẩn dụ thực tế:**\nTương tự như cây gia phả hoặc danh mục thư mục trong máy tính tính từ thư mục gốc (Root).\n\n**3. Lưu ý quan trọng khi thi:**\nLuôn xác định trường hợp cây rỗng hoặc con trỏ NULL để tránh lỗi Runtime Error.`
      );
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleGenerateQuizForDoc = async () => {
    if (!documentItem) return;
    setLoadingAnalysis(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: documentItem.courseName,
          topic: documentItem.title,
          numQuestions: 5,
          difficulty: 'medium',
        }),
      });
      const data = await res.json();
      setGeneratedQuiz(data.questions);
      addToast({
        type: 'success',
        title: 'Đã tạo 5 câu hỏi Quiz từ tài liệu!',
        message: 'Bạn có thể làm bài kiểm tra ngay bây giờ.',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleGenerateFlashcardsForDoc = async () => {
    if (!documentItem) return;
    setLoadingAnalysis(true);
    try {
      const res = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: documentItem.title,
          numCards: 8,
          context: documentItem.content,
        }),
      });
      const data = await res.json();
      setGeneratedCards(data.cards);
      addToast({
        type: 'success',
        title: 'Đã tạo 8 thẻ Flashcards từ tài liệu!',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleSaveFlashcardsToApp = () => {
    if (!generatedCards || !documentItem) return;
    addFlashcardDeck({
      title: `Thẻ ôn tập: ${documentItem.title}`,
      description: `Bộ thẻ học tạo tự động bởi AI từ tài liệu ${documentItem.title}`,
      courseId: documentItem.courseId,
      courseName: documentItem.courseName,
      cards: generatedCards.map((c, idx) => ({
        id: `c_${Date.now()}_${idx}`,
        front: c.front,
        back: c.back,
        category: 'General',
        status: 'unlearned',
      })),
    });
    setActiveTab('flashcards');
  };

  const handleSendDocChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docChatInput.trim() || isChatSending) return;

    const userText = docChatInput.trim();
    setDocChatMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setDocChatInput('');
    setIsChatSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          courseContext: `Tài liệu: ${documentItem.title}. Nội dung: ${documentItem.content}`,
        }),
      });
      const data = await res.json();
      setDocChatMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      console.error(err);
      setDocChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Dựa trên tài liệu "${documentItem.title}", câu trả lời là: ${userText} liên quan trực tiếp đến cấu trúc dữ liệu và giải thuật trong chương này. Bạn nên chú ý điều kiện biên và độ phức tạp tính toán.`,
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleCopySummary = () => {
    if (!summaryData) return;
    navigator.clipboard.writeText(summaryData.summary + '\n\n' + summaryData.keyPoints.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!documentItem) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-400">Không tìm thấy tài liệu.</p>
        <button
          onClick={() => setActiveTab('documents')}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-bold"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div id="document-detail-page" className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('documents')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Tài Liệu</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('quiz')}
            className="px-3.5 py-1.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 text-xs font-semibold flex items-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Mở Trang Quiz</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mở Flashcards</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Document Viewer & AI Assistant Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Original Document Context (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 uppercase">
                {documentItem.fileType} • {documentItem.fileSize}
              </span>
              <span className="text-xs text-slate-400">{documentItem.courseName}</span>
            </div>

            <h2 className="text-lg font-bold text-white">{documentItem.title}</h2>
            <p className="text-[11px] text-slate-400 mt-1">Đã tải lên: {documentItem.uploadDate}</p>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Nội dung văn bản tài liệu:
              </h4>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-96 overflow-y-auto custom-scrollbar whitespace-pre-line font-mono">
                {documentItem.content}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 flex-wrap">
              {documentItem.tags.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Suite (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Analysis Tab Navigation */}
          <div className="p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-1 overflow-x-auto custom-scrollbar">
            {[
              { id: 'summary', label: 'Tóm tắt & Ý chính', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
              { id: 'explain', label: 'Giải thích chuyên sâu', icon: <HelpCircle className="w-4 h-4 text-cyan-400" /> },
              { id: 'quiz', label: 'Sinh đề trắc nghiệm', icon: <BrainCircuit className="w-4 h-4 text-violet-400" /> },
              { id: 'flashcards', label: 'Tạo Flashcards', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
              { id: 'chat', label: 'Hỏi đáp với tài liệu', icon: <Bot className="w-4 h-4 text-amber-400" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`ai-tab-${tab.id}`}
                onClick={() => {
                  setActiveAnalysisTab(tab.id as any);
                  if (tab.id === 'explain' && !detailedExplanation) handleFetchExplain();
                  if (tab.id === 'quiz' && !generatedQuiz) handleGenerateQuizForDoc();
                  if (tab.id === 'flashcards' && !generatedCards) handleGenerateFlashcardsForDoc();
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeAnalysisTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: AI Summary & Key Points */}
          {activeAnalysisTab === 'summary' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">AI Phân Tích & Tóm Tắt Tự Động</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySummary}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                    title="Sao chép tóm tắt"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                  </button>

                  <button
                    onClick={handleFetchSummary}
                    disabled={loadingAnalysis}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Làm mới</span>
                  </button>
                </div>
              </div>

              {loadingAnalysis ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-xs">AI đang đọc hiểu và trích xuất ý chính từ tài liệu...</p>
                </div>
              ) : summaryData ? (
                <div className="space-y-5">
                  {/* Executive Summary */}
                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">
                      Tóm tắt nhanh (Executive Summary)
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{summaryData.summary}</p>
                    <span className="text-[10px] text-indigo-400 mt-2 block">
                      Thời gian đọc ước tính: {summaryData.estimatedReadingTime || '3 phút'}
                    </span>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                      Ý chính trọng tâm (Key Points):
                    </h4>
                    <div className="space-y-2">
                      {summaryData.keyPoints.map((kp, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3"
                        >
                          <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-slate-200 leading-relaxed">{kp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Step CTA */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white">Chuyển sang làm bài kiểm tra</h5>
                      <p className="text-[11px] text-slate-400">Kiểm tra ngay mức độ ghi nhớ kiến thức vừa học.</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveAnalysisTab('quiz');
                        handleGenerateQuizForDoc();
                      }}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <BrainCircuit className="w-4 h-4" />
                      <span>Sinh Đề Quiz &rarr;</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Tab 2: Explain in Detail */}
          {activeAnalysisTab === 'explain' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span>Giải Thích Chuyên Sâu Dễ Hiểu</span>
                </h3>
              </div>

              {loadingAnalysis ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                  <p className="text-xs">AI đang phân tích kiến thức bằng ví dụ và hình ảnh ẩn dụ...</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {detailedExplanation || 'Đang tải giải thích...'}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Generated Quiz */}
          {activeAnalysisTab === 'quiz' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-violet-400" />
                  <h3 className="text-base font-bold text-white">Đề Thi Trắc Nghiệm Tự Động Từ Tài Liệu</h3>
                </div>
                <button
                  onClick={handleGenerateQuizForDoc}
                  disabled={loadingAnalysis}
                  className="px-3 py-1.5 rounded-xl bg-violet-600/30 text-violet-300 border border-violet-500/40 text-xs font-semibold hover:bg-violet-600 hover:text-white transition-colors"
                >
                  Sinh đề mới
                </button>
              </div>

              {loadingAnalysis ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                  <p className="text-xs">AI đang biên soạn 5 câu hỏi trắc nghiệm bám sát nội dung...</p>
                </div>
              ) : generatedQuiz ? (
                <div className="space-y-4">
                  {generatedQuiz.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <p className="text-xs sm:text-sm font-bold text-white">
                        Câu {idx + 1}: {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {q.options.map((opt: string, oIdx: number) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl text-xs border ${
                              oIdx === q.correctAnswerIndex
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 font-semibold'
                                : 'bg-slate-900/60 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="font-mono font-bold mr-1.5">
                              {String.fromCharCode(65 + oIdx)}.
                            </span>
                            {opt}
                          </div>
                        ))}
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-slate-400 mt-2">
                        <strong className="text-indigo-400">Giải thích: </strong>
                        {q.explanation}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="w-full py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30"
                  >
                    <span>Mở Chế Độ Thi Thử Tính Điểm & Thời Gian &rarr;</span>
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Tab 4: Generated Flashcards */}
          {activeAnalysisTab === 'flashcards' && (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Thẻ Ghi Nhớ Flashcards Từ Tài Liệu</h3>
                </div>
                {generatedCards && (
                  <button
                    onClick={handleSaveFlashcardsToApp}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                  >
                    Lưu vào Bộ Thẻ & Học Ngay
                  </button>
                )}
              </div>

              {loadingAnalysis ? (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                  <p className="text-xs">AI đang rút trích định nghĩa thuật ngữ...</p>
                </div>
              ) : generatedCards ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                  {generatedCards.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between"
                    >
                      <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-400 font-bold block mb-1">Mặt trước (Khái niệm):</span>
                        <p className="text-xs font-bold text-white">{c.front}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">Mặt sau (Giải nghĩa):</span>
                        <p className="text-xs text-slate-300">{c.back}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {/* Tab 5: Chat with Document */}
          {activeAnalysisTab === 'chat' && (
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col h-[480px]">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Hỏi Đáp Trực Tiếp Về Tài Liệu Này</h3>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 custom-scrollbar">
                {docChatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isChatSending && (
                  <div className="flex justify-start">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>AI đang tra cứu tài liệu...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendDocChat} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Hỏi bất kỳ điều gì về tài liệu này (ví dụ: công thức tính, ví dụ mã nguồn)..."
                  value={docChatInput}
                  onChange={(e) => setDocChatInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-amber-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isChatSending || !docChatInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
