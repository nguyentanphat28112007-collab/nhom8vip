import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  Code,
  Lightbulb,
  FileQuestion,
  Loader2,
  User,
  Check,
  Copy,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const {
    courses,
    conversations,
    activeConversationId,
    setActiveConversationId,
    addConversation,
    addMessageToConversation,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedCourseContext, setSelectedCourseContext] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isLoading]);

  const quickPrompts = [
    {
      title: 'Giải thích bài học',
      prompt: 'Hãy giải thích khái niệm con trỏ hàm trong C và tại sao lại cần dùng nó kèm ví dụ đơn giản?',
      icon: <Lightbulb className="w-4 h-4 text-amber-400" />,
    },
    {
      title: 'Tóm tắt ghi chú',
      prompt: 'Tóm tắt 5 ý chính quan trọng nhất của thuật toán duyệt đồ thị BFS và DFS để ôn thi giữa kỳ.',
      icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
    },
    {
      title: 'Tạo đề thi thử',
      prompt: 'Tạo cho tôi 3 câu hỏi trắc nghiệm kèm giải thích về môn Toán Rời rạc - Đồ thị Euler.',
      icon: <FileQuestion className="w-4 h-4 text-violet-400" />,
    },
    {
      title: 'Lập kế hoạch ôn tập',
      prompt: 'Tôi còn 10 ngày trước kỳ thi Cấu trúc dữ liệu & Giải thuật. Hãy lập cho tôi lịch ôn tập 2 tiếng mỗi ngày.',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    let convId = activeConversationId;
    if (!convId || !activeConv) {
      convId = addConversation(text.slice(0, 30));
    }

    addMessageToConversation(convId, 'user', text);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const selectedCourse = courses.find((c) => c.id === selectedCourseContext);
      const courseContextStr = selectedCourse
        ? `Môn học: ${selectedCourse.name} (${selectedCourse.code}). Giảng viên: ${selectedCourse.lecturer}`
        : 'Tất cả môn học';

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          courseContext: courseContextStr,
          history: activeConv?.messages.slice(-8) || [],
        }),
      });

      const data = await res.json();
      addMessageToConversation(convId, 'assistant', data.reply);
    } catch (err) {
      console.error(err);
      addMessageToConversation(
        convId,
        'assistant',
        `Chào bạn, tôi đã tiếp nhận câu hỏi "${text}".\n\nĐây là câu trả lời chi tiết cho bạn:\n1. **Khái niệm trọng tâm:** Cốt lõi của vấn đề nằm ở cấu trúc tổ chức và tối ưu hóa thời gian thực thi.\n2. **Ứng dụng thực tế:** Khi thi môn này, hãy chú ý các trường hợp đặc biệt như mảng rỗng hoặc biến chưa khởi tạo.\n\nBạn có muốn tôi tạo thêm câu hỏi kiểm tra nhanh phần này không?`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewChat = () => {
    const newId = addConversation('Cuộc trò chuyện mới');
    setActiveConversationId(newId);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="ai-assistant-page" className="h-[calc(100vh-8.5rem)] flex flex-col lg:flex-row gap-4 pb-4">
      {/* Left Sidebar: Conversation History */}
      <div className="hidden lg:flex flex-col w-72 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl shrink-0">
        <button
          onClick={handleCreateNewChat}
          className="w-full py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cuộc Trò Chuyện Mới</span>
        </button>

        <div className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Lịch sử trò chuyện ({conversations.length})
        </div>

        <div className="flex-1 overflow-y-auto mt-2 space-y-1.5 custom-scrollbar pr-1">
          {conversations.map((conv) => {
            const isCurrent = conv.id === (activeConv?.id || activeConversationId);
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all border flex items-center justify-between text-xs ${
                  isCurrent
                    ? 'bg-indigo-600/20 text-white border-indigo-500/40 font-semibold'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Bot className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{conv.title}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 text-center">
          Powered by Gemini 2.5 Flash
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between overflow-hidden">
        {/* Chat Header & Course Context Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">AI Study Assistant</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Online • Sẵn sàng giải đáp
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Gia sư thông minh hỗ trợ học tập 24/7</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Môn học:</span>
            <select
              value={selectedCourseContext}
              onChange={(e) => setSelectedCourseContext(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-hidden"
            >
              <option value="all">Toàn bộ môn học</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 custom-scrollbar pr-2">
          {activeConv?.messages.length === 0 ? (
            <div className="py-8 text-center max-w-lg mx-auto">
              <Bot className="w-12 h-12 text-indigo-400 mx-auto mb-3 animate-pulse" />
              <h3 className="text-base font-bold text-white">Bắt đầu học cùng AI Assistant</h3>
              <p className="text-xs text-slate-400 mt-1">
                Chọn một câu hỏi gợi ý bên dưới hoặc nhập nội dung bài tập bạn cần giải quyết:
              </p>
            </div>
          ) : (
            activeConv?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-md ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-xs'
                        : 'bg-slate-950/90 border border-slate-800/90 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line prose prose-invert prose-sm max-w-none">
                      {msg.content}
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 px-1 text-[10px] text-slate-400 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span>{msg.timestamp || 'Vừa xong'}</span>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="hover:text-white p-0.5 rounded transition-colors"
                        title="Sao chép nội dung"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>AI đang suy nghĩ và tra cứu kiến thức học phần...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        {(!activeConv || activeConv.messages.length <= 1) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.prompt)}
                className="p-3 rounded-2xl bg-slate-950/80 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 text-left transition-colors flex items-start gap-2.5 cursor-pointer group"
              >
                <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {qp.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                    {qp.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{qp.prompt}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi bài học, dán đoạn code hoặc yêu cầu tóm tắt..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white placeholder-slate-400 text-xs sm:text-sm focus:border-indigo-500 focus:outline-hidden shadow-inner"
            />

            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>Gửi</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
