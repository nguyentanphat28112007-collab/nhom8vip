import React, { useState } from 'react';
import { useApp, TabType } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Flame,
  Info,
  Clock,
  Trash2,
  CheckCheck,
  Filter,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    addToast,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'unread') return !n.isRead;
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'ai_recommendation':
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
      case 'streak':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'deadline':
      default:
        return <Info className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleNotificationClick = (n: any) => {
    markNotificationRead(n.id);
    if (n.linkTab) {
      setActiveTab(n.linkTab as TabType);
      addToast({
        type: 'info',
        title: 'Chuyển hướng từ thông báo',
        message: `Mở mục ${n.linkTab}`,
      });
    }
  };

  return (
    <div id="notifications-page" className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Trung tâm Thông báo Học tập</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Notifications & Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Nhận thông báo nhắc nhở lịch thi, hạn nộp bài tập, duy trì chuỗi học tập và gợi ý từ AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Đánh dấu đã đọc tất cả</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filterType === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filterType === 'unread'
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Chưa đọc ({notifications.filter((n) => !n.isRead).length})
        </button>
        <button
          onClick={() => setFilterType('exam')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filterType === 'exam'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Lịch thi
        </button>
        <button
          onClick={() => setFilterType('deadline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filterType === 'deadline'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Hạn nộp Task
        </button>
        <button
          onClick={() => setFilterType('ai_recommendation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filterType === 'ai_recommendation'
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Khuyến nghị AI
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm">Không có thông báo nào trong mục này.</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'bg-slate-900/60 border-slate-800 opacity-75 hover:opacity-100 hover:border-slate-700'
                  : 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/40 shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {notif.time}
                    </span>
                    {notif.linkTab && (
                      <span className="text-indigo-400 font-semibold hover:underline">
                        Mở tính năng &rarr;
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                {!notif.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(notif.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                    title="Đánh dấu đã đọc"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
