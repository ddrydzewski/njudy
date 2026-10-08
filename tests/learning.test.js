import test from 'node:test';
import assert from 'node:assert/strict';
import { dateKey, emptyProgress, loadProgress, mathQuestion, recordSession, selectQuestions, streak } from '../src/learning.js';

test('storage recovers from corrupt data and rejects invalid counters', () => {
  assert.deepEqual(loadProgress({ getItem: () => '{' }), emptyProgress());
  const loaded = loadProgress({ getItem: () => JSON.stringify({ xp: -2, goal: 99, days: { bad: '3', good: 2 } }) });
  assert.equal(loaded.xp, 0);
  assert.equal(loaded.goal, 3);
  assert.deepEqual(loaded.days, { good: 2 });
});

test('session counts XP, mistakes and local daily activity without mutation', () => {
  const original = emptyProgress();
  const next = recordSession(original, 'programming', [{ id: 'a', correct: true }, { id: 'b', correct: false }], new Date(2026, 9, 8));
  assert.equal(next.xp, 15);
  assert.equal(next.days['2026-10-08'], 1);
  assert.equal(next.reviews.b, 1);
  assert.equal(original.xp, 0);
  const reviewed = recordSession(next, 'programming', [{ id: 'b', correct: true }]);
  assert.equal(reviewed.reviews.b, undefined);
});

test('streak includes yesterday until today is completed and breaks on gaps', () => {
  const progress = emptyProgress();
  progress.days = { '2026-10-06': 1, '2026-10-07': 2 };
  assert.equal(streak(progress, new Date(2026, 9, 8)), 2);
  assert.equal(streak(progress, new Date(2026, 9, 9)), 0);
  progress.days['2026-10-08'] = 1;
  assert.equal(streak(progress, new Date(2026, 9, 8)), 3);
});

test('questions with mistakes get priority and selections are unique', () => {
  const progress = emptyProgress();
  progress.reviews.b = 2;
  assert.equal(selectQuestions([{ id: 'a' }, { id: 'b' }, { id: 'c' }], progress, 1)[0].id, 'b');
});

test('generated arithmetic always has exactly one correct option', () => {
  for (let index = 0; index < 500; index++) {
    const question = mathQuestion(Math.random, index);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options.filter(option => option === question.answer).length, 1);
  }
});

test('date keys use local calendar dates', () => {
  assert.equal(dateKey(new Date(2026, 0, 2, 23, 59)), '2026-01-02');
});