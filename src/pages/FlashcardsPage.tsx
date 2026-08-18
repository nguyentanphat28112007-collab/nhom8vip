import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FlashcardDeck } from '../types';
import {
  Layers,
  Sparkles,
  Plus,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye,
  BrainCircuit,
  Trash2,
} from 'lucide-react';

export const FlashcardsPage: React.FC = () => {
  const { flashcardDecks, addFlashcardDeck, updateFlashcardStatus, courses, addToast } = useApp();

  const [selectedDeckId, setSelectedDeckId] = useState<string>(flashcardDecks[0]?.id || '');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Deck Creator / AI Generator
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckCourseId, setNewDeckCourseId] = useState(courses[0]?.id || '');
  const [aiPromptTopic, setAiPromptTopic] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const currentDeck = flashcardDecks.find((d) => d.id === selectedDeckId) || flashcardDecks[0];
  const currentCard = currentDeck?.cards[activeCardIndex];

  const masteredCount = currentDeck?.cards.filter((c) => c.status === 'mastered').length || 0;
  const reviewCount = currentDeck?.cards.filter((c) => c.status === 'need_review').length || 0;
  const totalCards = currentDeck?.cards.length || 1;
  const masteryPercentage = Math.round((masteredCount / totalCards) * 100);

  const handleNextCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev < (currentDeck?.cards.length || 1) - 1 ? prev + 1 : 0));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : (currentDeck?.cards.length || 1) - 1));
  };

  const handleMarkStatus = (status: 'need_review' | 'mastered') => {
    if (!currentDeck || !currentCard) return;
    updateFlashcardStatus(currentDeck.id, currentCard.id, status);
    handleNextCard();
  };

  const handleGenerateAiDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle || !aiPromptTopic) return;

    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPromptTopic,
          numCards: 8,
          context: `Môn học: ${courses.find((c) => c.id === newDeckCourseId)?.name}`,
        }),
      });

      const data = await res.json();
      const matchedCourse = courses.find((c) => c.id === newDeckCourseId);

      const newId = addFlashcardDeck({
        title: newDeckTitle,
        description: `Bộ thẻ ôn tập chủ đề: ${aiPromptTopic || newDeckTitle}`,
        courseId: newDeckCourseId,
        courseName: matchedCourse ? matchedCourse.name : 'Chung',
        cards: data.cards.map((c: any, idx: number) => ({
          id: `card_${Date.now()}_${idx}`,
          front: c.front,
          back: c.back,
          category: 'General',
          status: 'unlearned',
        })),
      });

      setSelectedDeckId(newId);
      setActiveCardIndex(0);
      setIsFlipped(false);
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div id="flashcards-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Flashcards & Spaced Repetition
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ghi nhớ định nghĩa, cú pháp lập trình và công thức nhanh gấp 3 lần bằng phương pháp lặp lại ngắt quãng.
          </p>
        </div>

        <button
          onClick={() => {
            setNewDeckTitle('');
            setAiPromptTopic('');
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Tạo Bộ Thẻ Mới Bằng AI</span>
        </button>
      </div>

      {/* Deck Selector Strip */}
      <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
        {flashcardDecks.map((deck) => {
          const isSelected = deck.id === (currentDeck?.id || selectedDeckId);
          return (
            <div
              key={deck.id}
              onClick={() => {
                setSelectedDeckId(deck.id);
                setActiveCardIndex(0);
                setIsFlipped(false);
              }}
              className={`p-3.5 rounded-2xl cursor-pointer border transition-all shrink-0 min-w-[220px] ${
                isSelected
                  ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-emerald-400">{deck.courseName}</span>
                <span className="text-[10px] text-slate-400">{deck.cards.length} thẻ</span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{deck.title}</h4>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Flashcard Trainer Box */}
      {currentCard && currentDeck ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress Bar & Deck Meta */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">
              Thẻ {activeCardIndex + 1} / {currentDeck.cards.length}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đã thuộc: {masteredCount}
              </span>
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Cần ôn: {reviewCount}
              </span>
              <span className="text-white font-mono">{masteryPercentage}%</span>
            </div>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[280px] sm:min-h-[320px] p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-800 hover:border-emerald-500/50 shadow-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 transform active:scale-98 select-none relative overflow-hidden"
          >
            {/* Top Card Badge */}
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  isFlipped
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isFlipped ? 'Mặt Sau (Định nghĩa & Bản chất)' : 'Mặt Trước (Thuật ngữ / Câu hỏi)'}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Click để lật thẻ</span>
              </span>
            </div>

            {/* Central Card Text */}
            <div className="my-auto text-center py-6">
              <p className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            {/* Card Footer Hint */}
            <div className="text-center text-[11px] text-slate-400">
              {isFlipped
                ? 'Hãy đánh giá xem bạn đã nhớ vững hay cần ôn lại thêm'
                : 'Thử nhớ lại định nghĩa trước khi lật thẻ'}
            </div>
          </div>

          {/* Action Buttons: Need Review vs Mastered */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={handlePrevCard}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Thẻ trước</span>
            </button>

            <button
              onClick={() => handleMarkStatus('need_review')}
              className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Cần ôn lại</span>
            </button>

            <button
              onClick={() => handleMarkStatus('mastered')}
              className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã thuộc</span>
            </button>

            <button
              onClick={handleNextCard}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <span>Thẻ sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400">Chưa có thẻ ghi nhớ nào trong bộ thẻ này.</div>
      )}

      {/* AI Deck Generator Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Sinh Bộ Thẻ Flashcards Bằng AI</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleGenerateAiDeck} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Bộ Thẻ *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ôn thi giữa kỳ - Con trỏ & Cây BST"
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thuộc Môn Học *</label>
                <select
                  value={newDeckCourseId}
                  onChange={(e) => setNewDeckCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Chủ Đề & Từ Khóa Cần Rút Trích *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Nhập các khái niệm, định nghĩa hoặc dán đoạn văn bản cần chuyển hóa thành Flashcards..."
                  value={aiPromptTopic}
                  onChange={(e) => setAiPromptTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isAiGenerating}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {isAiGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>AI đang tạo thẻ...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Tạo Bộ Thẻ Ngay</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
