import React, { useState } from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  Search,
  Flame,
  Bell,
  Sparkles,
  Bot,
  Plus,
  BookOpen,
  FolderSync,
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobile: () => void;
  isCollapsed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobile, isCollapsed }) => {
  const {
    setActiveTab,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    courses,
    documents,
    setSelectedCourseId,
    setSelectedDocumentId,
    addToast,
  } = useApp();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.isRead);

  // Search Results
  const filteredCourses = searchQuery.trim()
    ? courses.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredDocs = searchQuery.trim()
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSelectSearchResult = (type: 'course' | 'doc', id: string) => {
    setShowSearchModal(false);
    setSearchQuery('');
    if (type === 'course') {
      setSelectedCourseId(id);
      setActiveTab('course_detail');
    } else {
      setSelectedDocumentId(id);
      setActiveTab('document_detail');
    }
  };

  return (
    <>
      <header
        id="app-navbar"
        className={`sticky top-0 z-30 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
          {/* Left section: mobile hamburger & search bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              id="mobile-sidebar-toggle"
              onClick={onToggleMobile}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-hidden"
              aria-label="Mở menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Global Quick Search */}
            <div className="relative w-full max-w-md">
              <div
                onClick={() => setShowSearchModal(true)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer text-sm shadow-inner transition-colors"
              >
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">Tìm kiếm môn học, tài liệu, ghi chú...</span>
                <kbd className="hidden sm:inline-flex ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-400">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Quick AI Ask Button */}
            <button
              id="quick-ai-btn"
              onClick={() => setActiveTab('assistant')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold shadow-xs transition-all hover:scale-105"
            >
              <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>Hỏi AI</span>
            </button>

            {/* Study Streak Badge */}
            {user && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
                title={`Bạn đang có chuỗi học tập ${user.streakDays} ngày liên tục!`}
              >
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                <span>{user.streakDays} ngày streak</span>
              </div>
            )}

            {/* Notifications Popover */}
            <div className="relative">
              <button
                id="navbar-notif-btn"
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
                title="Thông báo"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
                )}
              </button>

              {showNotifPopover && (
                <div
                  id="notif-dropdown"
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Thông báo</span>
                      {unreadNotifs.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white">
                          {unreadNotifs.length} mới
                        </span>
                      )}
                    </div>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">Không có thông báo nào.</div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.linkTab) setActiveTab(notif.linkTab as TabType);
                            setShowNotifPopover(false);
                          }}
                          className={`p-3 rounded-xl cursor-pointer transition-colors border ${
                            notif.isRead
                              ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                              : 'bg-indigo-950/30 border-indigo-500/30'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {notif.type === 'exam' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                            {notif.type === 'ai_recommendation' && <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />}
                            {notif.type === 'streak' && <Flame className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                            {notif.type === 'deadline' && <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                              <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{notif.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">{notif.time}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setShowNotifPopover(false);
                      setActiveTab('notifications');
                    }}
                    className="w-full mt-3 py-2 text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold border-t border-slate-800/80 block"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              )}
            </div>

            {/* Profile Avatar Trigger */}
            {user && (
              <div
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-900 transition-colors"
                title="Hồ sơ cá nhân"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/50"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal Overlay */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-3 py-2 border-b border-slate-800">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Nhập tên môn học, tài liệu, thẻ bài giảng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-hidden text-sm"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
              >
                ESC
              </button>
            </div>

            {/* Results Section */}
            <div className="py-4 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {searchQuery.trim() === '' ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  <p>Nhập từ khóa để tìm kiếm nhanh các môn học và tài liệu đã lưu.</p>
                  <div className="flex justify-center gap-2 mt-4">
                    <span
                      onClick={() => setSearchQuery('Con trỏ')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700 text-xs"
                    >
                      #Con trỏ C
                    </span>
                    <span
                      onClick={() => setSearchQuery('BST')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700 text-xs"
                    >
                      #Cây nhị phân BST
                    </span>
                    <span
                      onClick={() => setSearchQuery('Euler')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700 text-xs"
                    >
                      #Toán rời rạc
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {filteredCourses.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                        Môn học ({filteredCourses.length})
                      </div>
                      <div className="space-y-1">
                        {filteredCourses.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => handleSelectSearchResult('course', c.id)}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-4 h-4 text-indigo-400" />
                              <div>
                                <span className="font-semibold text-xs text-white">{c.name}</span>
                                <p className="text-[11px] text-slate-400">{c.code} • {c.lecturer}</p>
                              </div>
                            </div>
                            <span className="text-xs text-indigo-400 font-semibold">Xem chi tiết &rarr;</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredDocs.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
                        Tài liệu ({filteredDocs.length})
                      </div>
                      <div className="space-y-1">
                        {filteredDocs.map((d) => (
                          <div
                            key={d.id}
                            onClick={() => handleSelectSearchResult('doc', d.id)}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FolderSync className="w-4 h-4 text-cyan-400" />
                              <div>
                                <span className="font-semibold text-xs text-white">{d.title}</span>
                                <p className="text-[11px] text-slate-400">{d.courseName}</p>
                              </div>
                            </div>
                            <span className="text-xs text-cyan-400 font-semibold">Phân tích AI &rarr;</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredCourses.length === 0 && filteredDocs.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400">
                      Không tìm thấy kết quả phù hợp cho "{searchQuery}".
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
