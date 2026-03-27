import { ExamType, Subject, SubjectId } from './types';

export const SUBJECTS: Subject[] = [
  {
    id: 'real-estate-intro',
    name: '부동산학개론',
    examType: 'first',
    questionCount: 40,
    pointsPerQuestion: 2.5,
  },
  {
    id: 'civil-law',
    name: '민법 및 민사특별법',
    examType: 'first',
    questionCount: 40,
    pointsPerQuestion: 2.5,
  },
  {
    id: 'broker-law',
    name: '공인중개사법령 및 중개실무',
    examType: 'second',
    session: 1,
    questionCount: 40,
    pointsPerQuestion: 2.5,
  },
  {
    id: 'public-law',
    name: '부동산공법',
    examType: 'second',
    session: 1,
    questionCount: 40,
    pointsPerQuestion: 2.5,
  },
  {
    id: 'tax-law',
    name: '부동산공시법령 및 세법',
    examType: 'second',
    session: 2,
    questionCount: 40,
    pointsPerQuestion: 2.5,
  },
];

export const EXAM_CONFIG: Record<ExamType, {
  label: string;
  description: string;
  subjects: SubjectId[];
  timeLimit: number;
  totalQuestions: number;
}> = {
  first: {
    label: '1차 시험',
    description: '부동산학개론 + 민법 및 민사특별법',
    subjects: ['real-estate-intro', 'civil-law'],
    timeLimit: 100 * 60,
    totalQuestions: 80,
  },
  'second-1': {
    label: '2차 시험 1교시',
    description: '중개사법/중개실무 + 부동산공법',
    subjects: ['broker-law', 'public-law'],
    timeLimit: 100 * 60,
    totalQuestions: 80,
  },
  'second-2': {
    label: '2차 시험 2교시',
    description: '부동산공시법령 및 세법',
    subjects: ['tax-law'],
    timeLimit: 50 * 60,
    totalQuestions: 40,
  },
};

export const PASS_CRITERIA = {
  minSubjectScore: 40,
  minAverageScore: 60,
  pointsPerQuestion: 2.5,
};

export function getSubjectById(id: SubjectId): Subject {
  return SUBJECTS.find(s => s.id === id)!;
}

export function getSubjectsByExamType(examType: ExamType): Subject[] {
  const config = EXAM_CONFIG[examType];
  return config.subjects.map(id => getSubjectById(id));
}
