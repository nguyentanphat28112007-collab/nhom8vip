import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp, TabType } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/layout/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { DocumentDetailPage } from './pages/DocumentDetailPage';
import { NotesPage } from './pages/NotesPage';
import { CalendarPage } from './pages/CalendarPage';
import { TasksPage } from './pages/TasksPage';
import { GradesPage } from './pages/GradesPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { QuizPage } from './pages/QuizPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // If on landing page, display clean full-screen landing view
  if (activeTab === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
        <LandingPage />
        <ToastContainer />
      </div>
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'courses':
        return <CoursesPage />;
      case 'course_detail':
        return <CourseDetailPage />;
      case 'documents':
        return <DocumentsPage />;
      case 'document_detail':
        return <DocumentDetailPage />;
      case 'notes':
        return <NotesPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'tasks':
        return <TasksPage />;
      case 'grades':
        return <GradesPage />;
      case 'assistant':
        return <AIAssistantPage />;
      case 'quiz':
        return <QuizPage />;
      case 'flashcards':
        return <FlashcardsPage />;
      case 'planner':
        return <StudyPlannerPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Top Navbar */}
      <Navbar
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
        isCollapsed={isCollapsed}
      />

      {/* Main App Content View Container */}
      <main
        className={`flex-1 transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-6 pb-16 ${
          isCollapsed ? 'lg:pl-28' : 'lg:pl-80'
        }`}
      >
        <div className="max-w-7xl mx-auto">{renderActiveTabContent()}</div>
      </main>

      {/* Global Interactive Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
