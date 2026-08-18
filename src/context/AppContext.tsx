import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Course,
  DocumentItem,
  NoteItem,
  TaskItem,
  ScheduleEvent,
  CourseGradeData,
  FlashcardDeck,
  StudyPlan,
  NotificationItem,
  AIConversation,
  QuizAttempt,
  QuizQuestion,
  TaskStatus,
} from '../types';
import {
  initialCourses,
  initialDocuments,
  initialNotes,
  initialTasks,
  initialScheduleEvents,
  initialCourseGrades,
  initialFlashcardDecks,
  initialStudyPlans,
  initialNotifications,
  initialConversations,
  initialQuizAttempts,
} from '../data/initialData';

export type TabType =
  | 'landing'
  | 'dashboard'
  | 'courses'
  | 'course_detail'
  | 'documents'
  | 'document_detail'
  | 'notes'
  | 'calendar'
  | 'tasks'
  | 'grades'
  | 'assistant'
  | 'quiz'
  | 'flashcards'
  | 'planner'
  | 'analytics'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'demo_flow';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface AppContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;

  // Data collections
  courses: Course[];
  documents: DocumentItem[];
  notes: NoteItem[];
  tasks: TaskItem[];
  scheduleEvents: ScheduleEvent[];
  courseGrades: CourseGradeData[];
  flashcardDecks: FlashcardDeck[];
  studyPlans: StudyPlan[];
  notifications: NotificationItem[];
  conversations: AIConversation[];
  activeConversationId: string | null;
  quizAttempts: QuizAttempt[];

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Actions
  addCourse: (course: Omit<Course, 'id' | 'progress' | 'averageGrade'>) => void;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => string;
  updateDocument: (id: string, updated: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;

  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateNote: (id: string, updated: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;

  addTask: (task: Omit<TaskItem, 'id'>) => void;
  updateTask: (id: string, updated: Partial<TaskItem>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;

  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateScheduleEvent: (id: string, updated: Partial<ScheduleEvent>) => void;
  deleteScheduleEvent: (id: string) => void;

  updateGradeScore: (courseId: string, componentId: string, newScore: number) => void;
  addGradeComponent: (courseId: string, name: string, weightPercent: number, score: number | null) => void;

  addFlashcardDeck: (deck: Omit<FlashcardDeck, 'id' | 'createdAt'>) => string;
  updateFlashcardStatus: (deckId: string, cardId: string, status: 'unlearned' | 'need_review' | 'mastered') => void;

  addStudyPlan: (plan: Omit<StudyPlan, 'id' | 'createdAt'>) => string;
  syncPlanToCalendar: (planId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  setActiveConversationId: (id: string | null) => void;
  addConversation: (title: string, courseId?: string) => string;
  addMessageToConversation: (convId: string, role: 'user' | 'assistant', content: string, context?: any) => void;

  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'date'>) => void;

  // Guided interactive demo
  runFullDemoFlow: () => Promise<void>;
  isDemoRunning: boolean;
  demoStep: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Load or fallback to initial Data
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ai_study_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('ai_study_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('ai_study_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('ai_study_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('ai_study_events');
    return saved ? JSON.parse(saved) : initialScheduleEvents;
  });

  const [courseGrades, setCourseGrades] = useState<CourseGradeData[]>(() => {
    const saved = localStorage.getItem('ai_study_grades');
    return saved ? JSON.parse(saved) : initialCourseGrades;
  });

  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('ai_study_decks');
    return saved ? JSON.parse(saved) : initialFlashcardDecks;
  });

  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('ai_study_plans');
    return saved ? JSON.parse(saved) : initialStudyPlans;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ai_study_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [conversations, setConversations] = useState<AIConversation[]>(() => {
    const saved = localStorage.getItem('ai_study_conversations');
    return saved ? JSON.parse(saved) : initialConversations;
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return initialConversations[0]?.id || null;
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    const saved = localStorage.getItem('ai_study_quizzes');
    return saved ? JSON.parse(saved) : initialQuizAttempts;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Persistence Sync
  useEffect(() => {
    localStorage.setItem('ai_study_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('ai_study_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('ai_study_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ai_study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('ai_study_events', JSON.stringify(scheduleEvents));
  }, [scheduleEvents]);

  useEffect(() => {
    localStorage.setItem('ai_study_grades', JSON.stringify(courseGrades));
  }, [courseGrades]);

  useEffect(() => {
    localStorage.setItem('ai_study_decks', JSON.stringify(flashcardDecks));
  }, [flashcardDecks]);

  useEffect(() => {
    localStorage.setItem('ai_study_plans', JSON.stringify(studyPlans));
  }, [studyPlans]);

  useEffect(() => {
    localStorage.setItem('ai_study_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ai_study_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('ai_study_quizzes', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  // Toast Helpers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Course handlers
  const addCourse = (course: Omit<Course, 'id' | 'progress' | 'averageGrade'>) => {
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}`,
      progress: 0,
      averageGrade: 0,
    };
    setCourses((prev) => [newCourse, ...prev]);
    // Create matching Grade component
    setCourseGrades((prev) => [
      ...prev,
      {
        courseId: newCourse.id,
        courseName: newCourse.name,
        credits: newCourse.credits,
        components: [
          { id: `c_${Date.now()}_1`, name: 'Chuyên cần', weightPercent: 10, score: null },
          { id: `c_${Date.now()}_2`, name: 'Giữa kỳ', weightPercent: 40, score: null },
          { id: `c_${Date.now()}_3`, name: 'Cuối kỳ', weightPercent: 50, score: null },
        ],
      },
    ]);
    addToast({
      type: 'success',
      title: 'Đã thêm môn học mới',
      message: `Môn ${newCourse.name} (${newCourse.code}) đã sẵn sàng.`,
    });
  };

  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    addToast({ type: 'info', title: 'Đã cập nhật thông tin môn học' });
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    addToast({ type: 'warning', title: 'Đã xóa môn học' });
  };

  // Document handlers
  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadDate'>): string => {
    const id = `doc_${Date.now()}`;
    const newDoc: DocumentItem = {
      ...doc,
      id,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    addToast({
      type: 'success',
      title: 'Tải tài liệu thành công!',
      message: `"${newDoc.title}" đã được lưu trữ và sẵn sàng để AI phân tích.`,
    });
    return id;
  };

  const updateDocument = (id: string, updated: Partial<DocumentItem>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    addToast({ type: 'info', title: 'Đã xóa tài liệu' });
  };

  // Note handlers
  const addNote = (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>): string => {
    const id = `note_${Date.now()}`;
    const now = new Date().toISOString();
    const newNote: NoteItem = {
      ...note,
      id,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    addToast({ type: 'success', title: 'Đã tạo ghi chú mới' });
    return id;
  };

  const updateNote = (id: string, updated: Partial<NoteItem>) => {
    const now = new Date().toISOString();
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated, updatedAt: now } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    addToast({ type: 'info', title: 'Đã xóa ghi chú' });
  };

  // Task handlers
  const addTask = (task: Omit<TaskItem, 'id'>) => {
    const id = `task_${Date.now()}`;
    const newTask: TaskItem = { ...task, id };
    setTasks((prev) => [newTask, ...prev]);
    addToast({
      type: 'success',
      title: 'Đã tạo nhiệm vụ mới',
      message: `Hạn nộp: ${newTask.deadline}`,
    });
  };

  const updateTask = (id: string, updated: Partial<TaskItem>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (status === 'Completed') {
      addToast({ type: 'success', title: 'Hoàn thành nhiệm vụ! 🎉' });
    }
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast({ type: 'info', title: 'Đã xóa nhiệm vụ' });
  };

  // Schedule Event handlers
  const addScheduleEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const id = `evt_${Date.now()}`;
    const newEvt: ScheduleEvent = { ...event, id };
    setScheduleEvents((prev) => [...prev, newEvt]);
    addToast({ type: 'success', title: 'Đã thêm sự kiện vào lịch học' });
  };

  const updateScheduleEvent = (id: string, updated: Partial<ScheduleEvent>) => {
    setScheduleEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
  };

  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents((prev) => prev.filter((e) => e.id !== id));
    addToast({ type: 'info', title: 'Đã xóa sự kiện lịch' });
  };

  // Grades Handlers
  const updateGradeScore = (courseId: string, componentId: string, newScore: number) => {
    setCourseGrades((prev) =>
      prev.map((cg) => {
        if (cg.courseId !== courseId) return cg;
        const updatedComps = cg.components.map((c) => (c.id === componentId ? { ...c, score: newScore } : c));
        return { ...cg, components: updatedComps };
      })
    );
    // Recalculate average grade on Course
    setTimeout(() => {
      setCourses((prevCourses) =>
        prevCourses.map((crs) => {
          if (crs.id !== courseId) return crs;
          const gradeEntry = courseGrades.find((cg) => cg.courseId === courseId);
          if (!gradeEntry) return crs;
          let weightedSum = 0;
          let totalWeight = 0;
          gradeEntry.components.forEach((c) => {
            if (c.score !== null) {
              const scoreVal = c.id === componentId ? newScore : c.score;
              weightedSum += (scoreVal || 0) * (c.weightPercent / 100);
              totalWeight += c.weightPercent / 100;
            }
          });
          const avg = totalWeight > 0 ? Number((weightedSum / totalWeight).toFixed(1)) : crs.averageGrade;
          return { ...crs, averageGrade: avg };
        })
      );
    }, 100);
    addToast({ type: 'success', title: 'Đã lưu điểm số thành công!' });
  };

  const addGradeComponent = (courseId: string, name: string, weightPercent: number, score: number | null) => {
    setCourseGrades((prev) =>
      prev.map((cg) => {
        if (cg.courseId !== courseId) return cg;
        return {
          ...cg,
          components: [...cg.components, { id: `comp_${Date.now()}`, name, weightPercent, score }],
        };
      })
    );
    addToast({ type: 'success', title: 'Đã thêm thành phần điểm' });
  };

  // Flashcards Handlers
  const addFlashcardDeck = (deck: Omit<FlashcardDeck, 'id' | 'createdAt'>): string => {
    const id = `deck_${Date.now()}`;
    const newDeck: FlashcardDeck = {
      ...deck,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFlashcardDecks((prev) => [newDeck, ...prev]);
    addToast({
      type: 'success',
      title: 'Tạo bộ thẻ Flashcard thành công!',
      message: `Đã tạo ${newDeck.cards.length} thẻ ghi nhớ.`,
    });
    return id;
  };

  const updateFlashcardStatus = (deckId: string, cardId: string, status: 'unlearned' | 'need_review' | 'mastered') => {
    setFlashcardDecks((prev) =>
      prev.map((deck) => {
        if (deck.id !== deckId) return deck;
        const updatedCards = deck.cards.map((c) => (c.id === cardId ? { ...c, status, lastReviewed: new Date().toISOString() } : c));
        return { ...deck, cards: updatedCards };
      })
    );
  };

  // Study Plan Handlers
  const addStudyPlan = (plan: Omit<StudyPlan, 'id' | 'createdAt'>): string => {
    const id = `plan_${Date.now()}`;
    const newPlan: StudyPlan = {
      ...plan,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      syncedToCalendar: false,
    };
    setStudyPlans((prev) => [newPlan, ...prev]);
    addToast({
      type: 'success',
      title: 'Kế hoạch học tập AI đã sẵn sàng!',
      message: `Lộ trình ${newPlan.totalWeeks} tuần ôn thi môn ${newPlan.subject}.`,
    });
    return id;
  };

  const syncPlanToCalendar = (planId: string) => {
    const plan = studyPlans.find((p) => p.id === planId);
    if (!plan) return;

    const newEvents: ScheduleEvent[] = [];
    const baseDate = new Date();

    plan.weeks.forEach((wk, wIdx) => {
      wk.tasks.forEach((tsk, tIdx) => {
        const eventDate = new Date(baseDate);
        eventDate.setDate(baseDate.getDate() + wIdx * 7 + tIdx * 2 + 1);
        const dateStr = eventDate.toISOString().split('T')[0];

        newEvents.push({
          id: `plan_evt_${Date.now()}_${wIdx}_${tIdx}`,
          title: `[Study Plan] ${tsk.title}`,
          type: 'study_session',
          courseName: plan.subject,
          date: dateStr,
          startTime: '19:00',
          endTime: `${19 + Math.min(Math.max(Math.round(tsk.durationHours), 1), 3)}:00`,
          location: 'Tự học tại nhà / Thư viện',
          notes: `Lộ trình ôn thi: ${wk.title}. Mẹo: ${wk.tip}`,
        });
      });
    });

    setScheduleEvents((prev) => [...prev, ...newEvents]);
    setStudyPlans((prev) => prev.map((p) => (p.id === planId ? { ...p, syncedToCalendar: true } : p)));

    addToast({
      type: 'success',
      title: 'Đã đồng bộ vào Calendar! 📅',
      message: `Đã thêm ${newEvents.length} phiên học vào lịch của bạn.`,
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast({ type: 'info', title: 'Đã đánh dấu đọc tất cả thông báo' });
  };

  // Conversations
  const addConversation = (title: string, courseId?: string): string => {
    const id = `conv_${Date.now()}`;
    const newConv: AIConversation = {
      id,
      title: title || 'Hội thoại mới',
      courseId,
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          role: 'assistant',
          content: `Chào bạn! Tôi là **AI Study Assistant** môn **${courseId ? courses.find((c) => c.id === courseId)?.name || 'học phần' : 'học tập'}**. Bạn cần tôi giúp giải thích bài giảng, tóm tắt tài liệu, giải bài tập hay lập kế hoạch học tập hôm nay?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(id);
    return id;
  };

  const addMessageToConversation = (convId: string, role: 'user' | 'assistant', content: string, context?: any) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role,
      content,
      timestamp: nowTime,
      context,
    };
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        return {
          ...c,
          updatedAt: new Date().toISOString(),
          messages: [...c.messages, newMsg],
        };
      })
    );
  };

  const recordQuizAttempt = (attempt: Omit<QuizAttempt, 'id' | 'date'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `attempt_${Date.now()}`,
      date: new Date().toLocaleString(),
    };
    setQuizAttempts((prev) => [newAttempt, ...prev]);
    addToast({
      type: 'success',
      title: `Hoàn thành Quiz! Điểm số: ${newAttempt.score}/${newAttempt.totalQuestions}`,
      message: `Đúng ${newAttempt.correctCount} câu, sai ${newAttempt.wrongCount} câu.`,
    });
  };

  // Automated Guided End-to-End Demo Flow
  const runFullDemoFlow = async () => {
    setIsDemoRunning(true);
    setDemoStep(1);
    addToast({
      type: 'info',
      title: 'Bắt đầu luồng Demo chuẩn 13 bước',
      message: 'Hệ thống sẽ tự động dẫn dắt toàn bộ chu trình học tập AI.',
    });

    // Step 1: Courses
    setActiveTab('courses');
    await new Promise((r) => setTimeout(r, 1200));

    // Step 2: Course detail
    setDemoStep(2);
    setSelectedCourseId('course_dsa');
    setActiveTab('course_detail');
    await new Promise((r) => setTimeout(r, 1200));

    // Step 3: Documents
    setDemoStep(3);
    setActiveTab('documents');
    setSelectedDocumentId('doc_2');
    await new Promise((r) => setTimeout(r, 1200));

    // Step 4: AI Analyze Doc
    setDemoStep(4);
    setActiveTab('document_detail');
    await new Promise((r) => setTimeout(r, 1500));

    // Step 5: AI Quiz generator
    setDemoStep(5);
    setActiveTab('quiz');
    await new Promise((r) => setTimeout(r, 1200));

    // Step 6: AI Study planner
    setDemoStep(6);
    setActiveTab('planner');
    await new Promise((r) => setTimeout(r, 1200));

    // Step 7: Calendar with synced events
    setDemoStep(7);
    setActiveTab('calendar');
    await new Promise((r) => setTimeout(r, 1200));

    // Step 8: Dashboard
    setDemoStep(8);
    setActiveTab('dashboard');
    setIsDemoRunning(false);
    addToast({
      type: 'success',
      title: 'Demo hoàn thành mỹ mãn! 🚀',
      message: 'Bạn có thể tự do khám phá và thao tác toàn bộ tính năng.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCourseId,
        setSelectedCourseId,
        selectedDocumentId,
        setSelectedDocumentId,
        courses,
        documents,
        notes,
        tasks,
        scheduleEvents,
        courseGrades,
        flashcardDecks,
        studyPlans,
        notifications,
        conversations,
        activeConversationId,
        quizAttempts,
        toasts,
        addToast,
        removeToast,
        addCourse,
        updateCourse,
        deleteCourse,
        addDocument,
        updateDocument,
        deleteDocument,
        addNote,
        updateNote,
        deleteNote,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        addScheduleEvent,
        updateScheduleEvent,
        deleteScheduleEvent,
        updateGradeScore,
        addGradeComponent,
        addFlashcardDeck,
        updateFlashcardStatus,
        addStudyPlan,
        syncPlanToCalendar,
        markNotificationRead,
        markAllNotificationsRead,
        setActiveConversationId,
        addConversation,
        addMessageToConversation,
        recordQuizAttempt,
        runFullDemoFlow,
        isDemoRunning,
        demoStep,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
