export const STORAGE_KEY = 'njudy-progress-v1';

export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function emptyProgress() {
  return { xp: 0, sessions: 0, correct: 0, answered: 0, days: {}, topics: {}, reviews: {}, goal: 3 };
}

export function loadProgress(storage) {
  try {
    const data = JSON.parse(storage.getItem(STORAGE_KEY));
    if (!data || typeof data !== 'object') return emptyProgress();
    const clean = emptyProgress();
    for (const key of ['xp', 'sessions', 'correct', 'answered']) {
      if (Number.isSafeInteger(data[key]) && data[key] >= 0) clean[key] = data[key];
    }
    if ([1, 3, 5].includes(data.goal)) clean.goal = data.goal;
    for (const key of ['days', 'topics', 'reviews']) {
      if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        clean[key] = Object.fromEntries(Object.entries(data[key]).filter(([name, count]) =>
          name !== '__proto__' && name !== 'constructor' && Number.isSafeInteger(count) && count >= 0));
      }
    }
    return clean;
  } catch {
    return emptyProgress();
  }
}

export function streak(progress, today = new Date()) {
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12);
  if (!progress.days[dateKey(cursor)]) cursor.setDate(cursor.getDate() - 1);
  let count = 0;
  while (progress.days[dateKey(cursor)] > 0) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}

export function shuffle(values, random = Math.random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function selectQuestions(questions, progress, limit = 5) {
  return shuffle(questions).sort((first, second) =>
    (progress.reviews[second.id] || 0) - (progress.reviews[first.id] || 0)).slice(0, limit);
}

export function mathQuestion(random = Math.random, index = 0) {
  const first = 2 + Math.floor(random() * 18);
  const second = 2 + Math.floor(random() * 10);
  const operation = Math.floor(random() * 3);
  const answer = operation === 0 ? first + second : operation === 1 ? first * second : first * second / second;
  const prompt = operation === 0 ? `${first} + ${second}` : operation === 1 ? `${first} × ${second}` : `${first * second} ÷ ${second}`;
  const options = shuffle([answer, answer + 1, answer + 3, Math.max(0, answer - 2)], random).map(String);
  return { id: `math-${index}-${prompt}`, prompt: `Ile to ${prompt}?`, options, answer: String(answer), explanation: `${prompt} = ${answer}.`, kind: 'math' };
}

export function recordSession(progress, topic, answers, today = new Date()) {
  if (!answers.length) return progress;
  const next = structuredClone(progress);
  const correct = answers.filter(answer => answer.correct).length;
  next.xp += correct * 10 + 5;
  next.sessions++;
  next.answered += answers.length;
  next.correct += correct;
  const key = dateKey(today);
  next.days[key] = (next.days[key] || 0) + 1;
  next.topics[topic] = (next.topics[topic] || 0) + 1;
  for (const answer of answers) {
    if (answer.correct) delete next.reviews[answer.id];
    else if (!answer.id.startsWith('math-')) next.reviews[answer.id] = (next.reviews[answer.id] || 0) + 1;
  }
  return next;
}