import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, musicQuestions, topics, articles } from '../src/content.js';

test('every curated question has unique ID and one correct answer', () => {
  const all = [...Object.values(questions).flat(), ...musicQuestions(), ...musicQuestions('bass')];
  assert.equal(new Set(all.map(question => question.id)).size, all.length);
  for (const question of all) {
    assert.ok(question.explanation);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.equal(question.options.filter(option => option === question.answer).length, 1);
  }
  for (const article of articles) assert.ok(topics.some(topic => topic.id === article.topic));
});

test('staff positions agree with standard treble and bass lines', () => {
  const treble = musicQuestions();
  const bass = musicQuestions('bass');
  assert.equal(treble[0].answer, 'C');
  assert.equal(treble[0].octave, 4);
  assert.deepEqual([2, 4, 6, 8, 10].map(position => treble[position].answer), ['E', 'G', 'H', 'D', 'F']);
  assert.deepEqual([2, 4, 6, 8, 10].map(position => bass[position].answer), ['G', 'H', 'D', 'F', 'A']);
  assert.equal(bass[2].octave, 2);
});