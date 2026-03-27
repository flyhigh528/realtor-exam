import { ExamType, Question, SubjectId, QuestionFile } from './types';
import { EXAM_CONFIG } from './constants';

import realEstateIntro from '@/data/questions/real-estate-intro.json';
import civilLaw from '@/data/questions/civil-law.json';
import brokerLaw from '@/data/questions/broker-law.json';
import publicLaw from '@/data/questions/public-law.json';
import taxLaw from '@/data/questions/tax-law.json';

// 추가 회차 데이터 - require()에 정적 문자열을 직접 사용해야 webpack이 클라이언트 번들에 포함시킴
const load = (mod: unknown): QuestionFile | null => (mod && (mod as QuestionFile).questions) ? mod as QuestionFile : null;

const extraRounds: Record<SubjectId, (QuestionFile | null)[]> = {
  'real-estate-intro': [
    load((() => { try { return require('@/data/questions/real-estate-intro-2.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/real-estate-intro-3.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/real-estate-intro-4.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/real-estate-intro-5.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/real-estate-intro-6.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/real-estate-intro-7.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/real-estate-intro-8.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/real-estate-intro-9.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/real-estate-intro-10.json'); } catch { return null; } })()),
  ],
  'civil-law': [
    load((() => { try { return require('@/data/questions/civil-law-2.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/civil-law-3.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/civil-law-4.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/civil-law-5.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/civil-law-6.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/civil-law-7.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/civil-law-8.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/civil-law-9.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/civil-law-10.json'); } catch { return null; } })()),
  ],
  'broker-law': [
    load((() => { try { return require('@/data/questions/broker-law-2.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/broker-law-3.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/broker-law-4.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/broker-law-5.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/broker-law-6.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/broker-law-7.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/broker-law-8.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/broker-law-9.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/broker-law-10.json'); } catch { return null; } })()),
  ],
  'public-law': [
    load((() => { try { return require('@/data/questions/public-law-2.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/public-law-3.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/public-law-4.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/public-law-5.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/public-law-6.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/public-law-7.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/public-law-8.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/public-law-9.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/public-law-10.json'); } catch { return null; } })()),
  ],
  'tax-law': [
    load((() => { try { return require('@/data/questions/tax-law-2.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/tax-law-3.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/tax-law-4.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/tax-law-5.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/tax-law-6.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/tax-law-7.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/tax-law-8.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/tax-law-9.json'); } catch { return null; } })()),
    load((() => { try { return require('@/data/questions/tax-law-10.json'); } catch { return null; } })()),
  ],
};

// 회차별 데이터 (1회차 + 존재하는 추가 회차만)
const questionsByRound: Record<SubjectId, QuestionFile[]> = {
  'real-estate-intro': [realEstateIntro as QuestionFile, ...extraRounds['real-estate-intro'].filter(Boolean) as QuestionFile[]],
  'civil-law': [civilLaw as QuestionFile, ...extraRounds['civil-law'].filter(Boolean) as QuestionFile[]],
  'broker-law': [brokerLaw as QuestionFile, ...extraRounds['broker-law'].filter(Boolean) as QuestionFile[]],
  'public-law': [publicLaw as QuestionFile, ...extraRounds['public-law'].filter(Boolean) as QuestionFile[]],
  'tax-law': [taxLaw as QuestionFile, ...extraRounds['tax-law'].filter(Boolean) as QuestionFile[]],
};

export function getAvailableRounds(subjectId: SubjectId): number {
  return questionsByRound[subjectId]?.length || 1;
}

export function getTotalQuestionCount(subjectId: SubjectId): number {
  return questionsByRound[subjectId]?.reduce((sum, f) => sum + f.questions.length, 0) || 0;
}

export function getQuestionsBySubject(subjectId: SubjectId, round?: number): Question[] {
  const rounds = questionsByRound[subjectId];
  if (!rounds) return [];
  if (round !== undefined && round >= 0 && round < rounds.length) {
    return rounds[round].questions;
  }
  return rounds.flatMap(f => f.questions);
}

export function getQuestionsByExamType(examType: ExamType, round?: number): Question[] {
  const config = EXAM_CONFIG[examType];
  return config.subjects.flatMap(subjectId => getQuestionsBySubject(subjectId, round));
}

export function getRandomQuestions(subjectId: SubjectId, count: number): Question[] {
  const all = getQuestionsBySubject(subjectId);
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
