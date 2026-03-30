export type ExamType = 'first' | 'second-1' | 'second-2';

export type SubjectId =
  | 'real-estate-intro'
  | 'civil-law'
  | 'broker-law'
  | 'public-law'
  | 'tax-law';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Choice {
  number: number;
  text: string;
  explanation?: string;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  choices: Choice[];
  answer: number;
  explanation: string;
  detailedExplanation?: string;
  difficulty: Difficulty;
  tags: string[];
  lawReference: string | null;
  year: number;
}

export interface Subject {
  id: SubjectId;
  name: string;
  examType: 'first' | 'second';
  session?: number;
  questionCount: number;
  pointsPerQuestion: number;
}

export interface QuestionFile {
  subjectId: SubjectId;
  subjectName: string;
  version: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  selectedChoice: number | null;
  isCorrect?: boolean;
}

export interface ExamState {
  examType: ExamType;
  subjects: SubjectId[];
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number | null>;
  startTime: number;
  timeLimit: number;
  isSubmitted: boolean;
}

export interface SubjectResult {
  subjectId: SubjectId;
  subjectName: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  isPassed: boolean;
}

export interface ExamResult {
  examType: ExamType;
  subjectResults: SubjectResult[];
  totalScore: number;
  isPassed: boolean;
  answers: UserAnswer[];
  questions: Question[];
  completedAt: string;
  timeSpent: number;
}

export interface WrongAnswer {
  questionId: string;
  subjectId: SubjectId;
  subjectName: string;
  question: Question;
  selectedChoice: number;
  examDate: string;
  reviewCount: number;
}

export interface ExamHistory {
  id: string;
  examType: ExamType;
  totalScore: number;
  isPassed: boolean;
  subjectResults: SubjectResult[];
  timeSpent: number;
  completedAt: string;
  totalQuestions: number;
  correctCount: number;
}

export interface Bookmark {
  questionId: string;
  subjectId: SubjectId;
  subjectName: string;
  question: Question;
  addedAt: string;
  memo?: string;
}
