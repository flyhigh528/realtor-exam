import { WrongAnswer, ExamResult, ExamHistory, Bookmark } from './types';

const WRONG_ANSWERS_KEY = 'realtor-exam-wrong-answers';
const EXAM_RESULT_KEY = 'realtor-exam-result';
const HISTORY_KEY = 'realtor-exam-history';
const BOOKMARK_KEY = 'realtor-exam-bookmarks';

export function getWrongAnswers(): WrongAnswer[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(WRONG_ANSWERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveWrongAnswers(wrongAnswers: WrongAnswer[]): void {
  localStorage.setItem(WRONG_ANSWERS_KEY, JSON.stringify(wrongAnswers));
}

export function addWrongAnswers(newWrongs: WrongAnswer[]): void {
  const existing = getWrongAnswers();
  const existingIds = new Set(existing.map(w => w.questionId));
  const toAdd = newWrongs.filter(w => !existingIds.has(w.questionId));
  saveWrongAnswers([...existing, ...toAdd]);
}

export function removeWrongAnswer(questionId: string): void {
  const existing = getWrongAnswers();
  saveWrongAnswers(existing.filter(w => w.questionId !== questionId));
}

export function markReviewed(questionId: string): void {
  const existing = getWrongAnswers();
  const updated = existing.map(w =>
    w.questionId === questionId
      ? { ...w, reviewCount: w.reviewCount + 1 }
      : w
  );
  saveWrongAnswers(updated);
}

export function saveExamResult(result: ExamResult): void {
  sessionStorage.setItem(EXAM_RESULT_KEY, JSON.stringify(result));
}

export function getExamResult(): ExamResult | null {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem(EXAM_RESULT_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearExamResult(): void {
  sessionStorage.removeItem(EXAM_RESULT_KEY);
}

// --- 성적 히스토리 ---
export function getHistory(): ExamHistory[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function addHistory(result: ExamResult): void {
  const history = getHistory();
  const entry: ExamHistory = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    examType: result.examType,
    totalScore: result.totalScore,
    isPassed: result.isPassed,
    subjectResults: result.subjectResults,
    timeSpent: result.timeSpent,
    completedAt: result.completedAt,
    totalQuestions: result.questions.length,
    correctCount: result.answers.filter(a => a.isCorrect).length,
  };
  history.unshift(entry);
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// --- 북마크 ---
export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(BOOKMARK_KEY);
  return data ? JSON.parse(data) : [];
}

export function addBookmark(bookmark: Bookmark): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.find(b => b.questionId === bookmark.questionId)) {
    bookmarks.unshift(bookmark);
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(questionId: string): void {
  const bookmarks = getBookmarks();
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks.filter(b => b.questionId !== questionId)));
}

export function isBookmarked(questionId: string): boolean {
  return getBookmarks().some(b => b.questionId === questionId);
}
