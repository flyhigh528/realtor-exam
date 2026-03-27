import { ExamType, Question, Subject, SubjectResult, ExamResult, UserAnswer } from './types';
import { PASS_CRITERIA, getSubjectsByExamType } from './constants';

export function gradeExam(
  examType: ExamType,
  questions: Question[],
  answers: Record<string, number | null>,
  timeSpent: number
): ExamResult {
  const subjects = getSubjectsByExamType(examType);

  const subjectQuestionMap = new Map<string, Question[]>();
  for (const q of questions) {
    const prefix = q.id.split('-')[0];
    const existing = subjectQuestionMap.get(prefix) || [];
    existing.push(q);
    subjectQuestionMap.set(prefix, existing);
  }

  const prefixToSubject: Record<string, Subject> = {
    ri: subjects.find(s => s.id === 'real-estate-intro')!,
    cl: subjects.find(s => s.id === 'civil-law')!,
    bl: subjects.find(s => s.id === 'broker-law')!,
    pl: subjects.find(s => s.id === 'public-law')!,
    tl: subjects.find(s => s.id === 'tax-law')!,
  };

  const subjectResults: SubjectResult[] = [];

  for (const [prefix, subjectQuestions] of subjectQuestionMap) {
    const subject = prefixToSubject[prefix];
    if (!subject) continue;

    const correctCount = subjectQuestions.filter(
      q => answers[q.id] === q.answer
    ).length;
    const score = correctCount * subject.pointsPerQuestion;

    subjectResults.push({
      subjectId: subject.id,
      subjectName: subject.name,
      totalQuestions: subjectQuestions.length,
      correctCount,
      score,
      isPassed: score >= PASS_CRITERIA.minSubjectScore,
    });
  }

  const totalScore =
    subjectResults.reduce((sum, r) => sum + r.score, 0) / subjectResults.length;
  const allSubjectsPassed = subjectResults.every(r => r.isPassed);
  const isPassed = allSubjectsPassed && totalScore >= PASS_CRITERIA.minAverageScore;

  const userAnswers: UserAnswer[] = questions.map(q => ({
    questionId: q.id,
    selectedChoice: answers[q.id] ?? null,
    isCorrect: answers[q.id] === q.answer,
  }));

  return {
    examType,
    subjectResults,
    totalScore: Math.round(totalScore * 10) / 10,
    isPassed,
    answers: userAnswers,
    questions,
    completedAt: new Date().toISOString(),
    timeSpent,
  };
}
