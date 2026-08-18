import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  FolderSync,
  FileText,
  Calendar,
  CheckSquare,
  Award,
  Bot,
  BrainCircuit,
  Sparkles,
  Layers,
  CalendarClock,
  TrendingUp,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  PlayCircle,
} from 'lucide-react';
import { TabType } from '../../context/AppContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { activeTab, setActiveTab, notifications, tasks, runFullDemoFlow, isDemoRunning } = useApp();
  const { user, logout } = useAuth();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string; isAi?: boolean }[] = [
    { id: 'dashboard', label: 'Tổng quan (Dashboard)', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'courses', label: 'Môn học (My Courses)', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'documents', label: 'Tài liệu (Documents)', icon: <FolderSync className="w-5 h-5" /> },
    { id: 'notes', label: 'Ghi chú (Smart Notes)', icon: <FileText className="w-5 h-5" /> },
    { id: 'calendar', label: 'Lịch học (Calendar)', icon: <Calendar className="w-5 h-5" /> },
    { id: 'tasks', label: 'Nhiệm vụ (Tasks)', icon: <CheckSquare className="w-5 h-5" />, badge: pendingTasks, badgeColor: 'bg-amber-500' },
    { id: 'grades', label: 'Điểm số & GPA (Grades)', icon: <Award className="w-5 h-5" /> },
  ];

  const aiItems: { id: TabType; label: string; icon: React.ReactNode; isAi?: boolean }[] = [
    { id: 'assistant', label: 'AI Study Assistant', icon: <Bot className="w-5 h-5 text-indigo-400" />, isAi: true },
    { id: 'quiz', label: 'AI Quiz Generator', icon: <BrainCircuit className="w-5 h-5 text-violet-400" />, isAi: true },
    { id: 'flashcards', label: 'AI Flashcards', icon: <Layers className="w-5 h-5 text-emerald-400" />, isAi: true },
    { id: 'planner', label: 'AI Study Planner', icon: <CalendarClock className="w-5 h-5 text-amber-400" />, isAi: true },
    { id: 'analytics', label: 'AI Learning Analytics', icon: <TrendingUp className="w-5 h-5 text-rose-400" />, isAi: true },
  ];

  const systemItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'notifications', label: 'Thông báo', icon: <Bell className="w-5 h-5" />, badge: unreadNotifs },
    { id: 'profile', label: 'Hồ sơ sinh viên', icon: <User className="w-5 h-5" /> },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-slate-950/95 border-r border-slate-800 backdrop-blur-xl transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-white font-sans">AI Study</span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PRO</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Assistant Platform</span>
              </div>
            )}
          </div>

          <button
            id="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Quick Demo CTA Button */}
        {!isCollapsed ? (
          <div className="px-3 pt-3">
            <button
              id="sidebar-run-demo-btn"
              onClick={runFullDemoFlow}
              disabled={isDemoRunning}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4 animate-pulse text-cyan-200" />
              <span>{isDemoRunning ? 'Đang chạy Demo tự động...' : 'Chạy Demo 13 Bước Chuẩn'}</span>
            </button>
          </div>
        ) : (
          <div className="p-2 flex justify-center">
            <button
              onClick={runFullDemoFlow}
              disabled={isDemoRunning}
              title="Chạy Demo chuẩn 13 bước"
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30"
            >
              <PlayCircle className="w-5 h-5 animate-pulse text-cyan-200" />
            </button>
          </div>
        )}

        {/* Navigation Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6 custom-scrollbar">
          {/* Main Study Hub */}
          <div>
            {!isCollapsed && (
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <span>Không gian học tập</span>
              </div>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className={`ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold text-white ${item.badgeColor || 'bg-indigo-600'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI Intelligence Suite */}
          <div>
            {!isCollapsed && (
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Hỗ trợ chuyên sâu</span>
              </div>
            )}
            <nav className="space-y-1">
              {aiItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-ai-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/25 to-violet-500/20 text-white border border-indigo-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span>{item.icon}</span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* System & Account */}
          <div>
            {!isCollapsed && (
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                <span>Cá nhân & Cài đặt</span>
              </div>
            )}
            <nav className="space-y-1">
              {systemItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-rose-500 animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card at Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80">
          {user ? (
            <div
              className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group ${
                isCollapsed ? 'justify-center' : ''
              }`}
              onClick={() => setActiveTab('profile')}
              title="Xem và chỉnh sửa hồ sơ / đổi ảnh đại diện"
            >
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-500 shrink-0 transition-all"
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{user.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user.major}</p>
                </div>
              )}
              {!isCollapsed && (
                <button
                  id="logout-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    logout();
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('landing')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
