export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  major: string;
  year: string;
  studyGoals: string;
  gpaTarget: number;
  streakDays: number;
  totalStudyHours: number;
  lastActiveDate: string;
  language: 'vi' | 'en';
  darkMode: boolean;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  room: string;
  credits: number;
  color: string;
  description: string;
  progress: number;
  averageGrade: number;
  term: string;
}

export type FileType = 'pdf' | 'docx' | 'pptx' | 'txt' | 'img';

export interface DocumentItem {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  fileType: FileType;
  fileSize: string;
  uploadDate: string;
  content: string;
  summary?: string;
  keyPoints?: string[];
  explanation?: string;
  tags: string[];
  isFavorite?: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  estimatedHours?: number;
}

export type EventType = 'class' | 'exam' | 'deadline' | 'study_session';

export interface ScheduleEvent {
  id: string;
  title: string;
  type: EventType;
  courseId?: string;
  courseName?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface GradeComponent {
  id: string;
  name: string;
  weightPercent: number;
  score: number | null;
}

export interface CourseGradeData {
  courseId: string;
  courseName: string;
  credits: number;
  components: GradeComponent[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userSelected?: number;
}

export interface QuizAttempt {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionType: 'Multiple Choice' | 'True / False';
  date: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  timeSpentSeconds: number;
  questions: QuizQuestion[];
  aiFeedback?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  status: 'unlearned' | 'need_review' | 'mastered';
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  description: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface StudyPlanTask {
  id: string;
  title: string;
  durationHours: number;
  completed: boolean;
}

export interface StudyPlanWeek {
  weekNumber: number;
  title: string;
  focusTopics: string[];
  tasks: StudyPlanTask[];
  recommendedMaterials: string[];
  tip: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  courseId?: string;
  examDate: string;
  targetGrade: string;
  dailyHours: number;
  totalWeeks: number;
  weeks: StudyPlanWeek[];
  keyStrategies: string[];
  createdAt: string;
  syncedToCalendar?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'exam' | 'deadline' | 'task' | 'ai_recommendation' | 'streak';
  time: string;
  isRead: boolean;
  linkTab?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    courseName?: string;
    documentTitle?: string;
  };
}

export interface AIConversation {
  id: string;
  title: string;
  courseId?: string;
  updatedAt: string;
  messages: ChatMessage[];
}
