import './style.css';
import { createIcons, Sun, Compass, Bookmark, ChartNoAxesColumnIncreasing, Flame, Smile, SlidersHorizontal, ChevronRight, ArrowRight, ArrowLeft, X, Check, CheckCheck, CodeXml, Music2, Languages, Calculator, Palette, Lightbulb, ChartNoAxesCombined, Orbit, Clock3, Sparkles, Volume2, ExternalLink, Layers, Brain, Timer, Trophy, Target, RotateCcw, Download, Trash2, WifiOff, RefreshCw, Plus, BookOpen } from 'lucide';
import { topics, questions, articles, musicQuestions, words, wordFallback } from './content.js';
import { STORAGE_KEY, dateKey, emptyProgress, loadProgress, mathQuestion, recordSession, selectQuestions, shuffle, streak } from './learning.js';

const iconSet = { Sun, Compass, Bookmark, ChartNoAxesColumnIncreasing, Flame, Smile, SlidersHorizontal, ChevronRight, ArrowRight, ArrowLeft, X, Check, CheckCheck, CodeXml, Music2, Languages, Calculator, Palette, Lightbulb, ChartNoAxesCombined, Orbit, Clock3, Sparkles, Volume2, ExternalLink, Layers, Brain, Timer, Trophy, Target, RotateCcw, Download, Trash2, WifiOff, RefreshCw, Plus, BookOpen };
const main = document.querySelector('#main');
const lessonDialog = document.querySelector('#lesson-dialog');
const readerDialog = document.querySelector('#reader-dialog');
const settingsDialog = document.querySelector('#settings-dialog');
let progress;
try { progress = loadProgress(localStorage); } catch { progress = emptyProgress(); }
let saved = readJSON('njudy-saved-v1', []);
saved = Array.isArray(saved) ? [...new Set(saved)].filter(id => articles.some(article => article.id === id)) : [];
let clef = readJSON('njudy-clef-v1', 'treble');
if (!['treble', 'bass'].includes(clef)) clef = 'treble';
let session = null;
let filter = 'all';
let installPrompt = null;
let toastTimer;
let storageWarning = false;
const dayNumber = Math.floor(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) / 86400000);
const dailyWord = words[dayNumber % words.length];
let wordInfo = { word: dailyWord, translation: wordFallback[dailyWord][0], definition: wordFallback[dailyWord][1], phonetic: '', audio: '', licenseName: '', licenseURL: '', live: false };
let artInfo = { title: 'Wheat Field with Cypresses', artist: 'Vincent van Gogh', date: '1889', image: './artwork.jpg', url: 'https://www.metmuseum.org/art/collection/search/436535', live: false };
let artLoading = false;

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch {
    if (!storageWarning) toast('Pamięć jest niedostępna. Postęp pozostanie tylko do zamknięcia aplikacji.');
    storageWarning = true;
    return false;
  }
}

function escape(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function safeURL(value) {
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}

function icon(name) { return `<i data-lucide="${name}" aria-hidden="true"></i>`; }
function icons() { createIcons({ icons: iconSet }); }
function topicFor(id) { return topics.find(topic => topic.id === id); }
function view() { return ['today', 'explore', 'saved', 'progress'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'today'; }

function wordCredit() {
  if (!wordInfo.live) return '';
  return `<div class="api-credit"><a href="https://en.wiktionary.org/wiki/${encodeURIComponent(dailyWord)}" target="_blank" rel="noopener noreferrer">Wiktionary</a>${wordInfo.licenseURL ? ` · <a href="${escape(wordInfo.licenseURL)}" target="_blank" rel="noopener noreferrer">${escape(wordInfo.licenseName || 'Licencja')}</a>` : ''}</div>`;
}

function toast(message) {
  const element = document.querySelector('#toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 4500);
}

function header() {
  document.querySelector('#header-streak').textContent = streak(progress);
  document.querySelector('#saved-count').textContent = saved.length;
  document.querySelector('#connection-text').textContent = navigator.onLine ? 'Gotowe do nauki' : 'Tryb offline';
  document.querySelectorAll('[data-view]').forEach(link => {
    link.classList.toggle('active', link.dataset.view === view());
    if (link.dataset.view === view()) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function topicTile(topic) {
  const done = progress.topics[topic.id] || 0;
  return `<button class="topic ${topic.color}" data-topic="${topic.id}"><div class="topic-top"><span class="topic-icon">${icon(topic.icon)}</span><span class="topic-tag">${topic.tag}</span></div><h3>${topic.name}</h3><p>${topic.subtitle}</p><div class="topic-bottom"><span>${done ? `${done} treningów za tobą` : topic.count}</span>${icon('arrow-right')}</div></button>`;
}

function renderDiscovery() {
  return `<div class="discovery-grid"><article class="discovery art-discovery"><img class="art-image" src="${escape(artInfo.image)}" alt="${escape(artInfo.title)} — ${escape(artInfo.artist)}" loading="lazy" /><div class="discovery-content"><div class="mini-label">${icon('palette')} OBRAZ NA DZIŚ</div><h3>${escape(artInfo.artist)}</h3><p>${escape(artInfo.title)}<br />${escape(artInfo.date)} · The Met</p><button class="text-button" data-action="art">Zatrzymaj wzrok ${icon('arrow-right')}</button></div></article><article class="discovery word-discovery"><div class="discovery-content"><div class="mini-label">${icon('languages')} SŁOWO NA DZIŚ</div><div class="word-row"><h3>${escape(wordInfo.word)}</h3><button class="icon-button" data-action="speak" aria-label="Posłuchaj wymowy ${escape(wordInfo.word)}" title="Posłuchaj wymowy">${icon('volume-2')}</button></div><p class="word-translation">${escape(wordInfo.translation)}</p><p class="word-definition">${escape(wordInfo.definition)}</p>${wordCredit()}<button class="text-button" data-action="word">Poznaj bliżej ${icon('arrow-right')}</button></div></article></div>`;
}

function renderToday() {
  const completed = progress.days[dateKey()] || 0;
  const goalDone = completed >= progress.goal;
  const date = new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  main.innerHTML = `<div class="view-enter"><section class="intro"><div><div class="eyebrow">${icon('sparkles')} MAŁA DAWKA, DUŻA RÓŻNICA</div><h1>Daj głowie coś dobrego<span style="color:#7e9a62">.</span></h1><p>Zamiast kolejnego scrolla — kilka minut dla ciekawości.</p></div><span class="date-label">${escape(date)}</span></section><section class="daily-band" aria-label="Codzienny trening"><div class="daily-main"><div class="daily-title-row">TWÓJ CODZIENNY MIX <span class="pill">5 PYTAŃ</span></div><h2>Trochę kodu. Trochę świata.</h2><p>Programowanie, jedna nuta i coś nieoczywistego.<br />Mały trening, po którym zostaje coś więcej.</p><div class="daily-bottom"><button class="primary" data-topic="mix">${goalDone ? 'Jeszcze odrobina?' : 'Zaczynamy'} ${icon('arrow-right')}</button><span class="daily-meta">${icon('clock-3')} około 3 min ${icon('sparkles')} do 55 XP</span></div></div><div class="daily-goal"><div class="goal-label"><span>Dzienny cel</span><strong>${completed} / ${progress.goal} treningów</strong></div><div class="goal-track" role="progressbar" aria-label="Dzienny cel" aria-valuenow="${Math.min(completed, progress.goal)}" aria-valuemin="0" aria-valuemax="${progress.goal}"><span style="width:${Math.min(100, completed / progress.goal * 100)}%"></span></div><div class="goal-title">${goalDone ? 'Na dziś? Dobra robota.' : 'Nie musisz robić wszystkiego.'}</div><p class="goal-note">${goalDone ? 'Cel osiągnięty. Odpoczynek też jest ważny.' : 'Wystarczy zacząć od jednego małego kroku.'}</p></div></section><section><div class="section-header"><div><h2>Na co masz dziś ochotę?</h2><p>Wybierz swoją ścieżkę. Reszta może poczekać.</p></div><a class="text-button" href="#explore">Odkrywaj ${icon('arrow-right')}</a></div><div class="topics-grid">${topics.map(topicTile).join('')}</div></section><section class="discovery-section"><div class="section-header"><div><h2>Świat jest całkiem ciekawy.</h2><p>Dwie małe rzeczy na dobry początek.</p></div>${icon('sparkles')}</div><div id="discovery-feed">${renderDiscovery()}</div></section></div>`;
}

function articleTile(article) {
  const topic = topicFor(article.topic);
  const isSaved = saved.includes(article.id);
  return `<article class="article-tile ${topic.color}"><div class="article-tile-top"><span class="topic-icon">${icon(article.icon)}</span><button class="icon-button ${isSaved ? 'is-saved' : ''}" data-save="${article.id}" aria-label="${isSaved ? 'Usuń z zapisanych' : 'Zapisz'}: ${escape(article.title)}" aria-pressed="${isSaved}" title="${isSaved ? 'Usuń z zapisanych' : 'Zapisz na później'}">${icon('bookmark')}</button></div><h3><a href="#article-${article.id}" data-article="${article.id}">${article.title}</a></h3><p>${article.subtitle}</p><div class="article-tile-bottom"><span>${topic.name} · ${article.minutes} min</span><button class="text-button" data-article="${article.id}">Czytaj ${icon('arrow-right')}</button></div></article>`;
}

function renderExplore() {
  const visible = articles.filter(article => filter === 'all' || article.topic === filter);
  main.innerHTML = `<div class="view-enter"><section class="intro"><div><div class="eyebrow">${icon('compass')} IDŹ ZA CIEKAWOŚCIĄ</div><h1>Jeszcze jeden dobry pomysł.</h1><p>Krótkie teksty. Nowe perspektywy. Coś do przemyślenia.</p></div></section><div class="filters" role="group" aria-label="Filtruj dziedziny"><button class="filter" data-filter="all" aria-pressed="${filter === 'all'}">Wszystko</button>${topics.map(topic => `<button class="filter" data-filter="${topic.id}" aria-pressed="${filter === topic.id}">${topic.name}</button>`).join('')}</div><div class="articles-grid">${visible.map(articleTile).join('')}</div><section class="discovery-section"><div class="section-header"><h2>Praktyka zostaje w głowie.</h2></div><div class="topics-grid">${topics.filter(topic => filter === 'all' || topic.id === filter).map(topicTile).join('')}</div></section></div>`;
}

function renderSaved() {
  const visible = articles.filter(article => saved.includes(article.id));
  main.innerHTML = `<div class="view-enter"><section class="intro"><div><div class="eyebrow">${icon('bookmark')} WRÓĆ, KIEDY MASZ CHWILĘ</div><h1>Dobre rzeczy na później.</h1><p>Twoja mała kolekcja pomysłów.</p></div></section>${visible.length ? `<div class="articles-grid">${visible.map(articleTile).join('')}</div>` : `<div class="empty-state">${icon('bookmark')}<h2>Jeszcze czysta kartka.</h2><p>Coś wpadło ci w oko? Zapisz tekst i wróć do niego w spokojnej chwili.</p><a class="primary" href="#explore">Odkryj coś ${icon('arrow-right')}</a></div>`}</div>`;
}

function renderProgress() {
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + index, 12);
    const done = progress.days[dateKey(day)] || 0;
    return `<div class="week-day"><div class="week-circle ${done ? 'done' : ''} ${index === 6 ? 'today' : ''}" title="${dateKey(day)}: ${done} treningów">${done ? icon('check') : day.getDate()}</div>${new Intl.DateTimeFormat('pl-PL', { weekday: 'short' }).format(day)}</div>`;
  }).join('');
  const totalReviews = Object.keys(progress.reviews).length;
  main.innerHTML = `<div class="view-enter"><section class="intro"><div><div class="eyebrow">${icon('chart-no-axes-column-increasing')} MAŁE KROKI SIĘ SUMUJĄ</div><h1>Trochę dalej niż wczoraj.</h1><p>Nie ścigasz się z nikim. To twój własny rytm.</p></div></section><div class="stats-grid">${[['sparkles', progress.xp, 'punktów doświadczenia'], ['flame', streak(progress), 'dni w aktualnej serii'], ['check-check', progress.sessions, 'ukończonych treningów'], ['target', progress.answered ? `${Math.round(progress.correct / progress.answered * 100)}%` : '—', 'poprawnych odpowiedzi']].map(([name, number, label]) => `<div class="stat">${icon(name)}<strong>${number}</strong><span>${label}</span></div>`).join('')}</div><div class="section-header"><h2>Twój ostatni tydzień</h2><button class="text-button" data-action="settings">Cel: ${progress.goal} dziennie ${icon('sliders-horizontal')}</button></div><div class="week">${week}</div><section class="discovery-section"><div class="section-header"><h2>Każda dziedzina, własne tempo.</h2></div>${topics.map(topic => `<div class="progress-topic ${topic.color}"><span class="topic-icon">${icon(topic.icon)}</span><strong>${topic.name}</strong><span>${progress.topics[topic.id] || 0} treningów</span></div>`).join('')}</section><div class="progress-tip">${icon('brain')}<span>${totalReviews ? `${totalReviews} pytań czeka na powtórkę. Pojawią się wcześniej w treningach swoich dziedzin.` : 'Błędy nie zabierają punktów. Pomagają znaleźć to, co warto powtórzyć.'}</span></div></div>`;
}

function render() {
  header();
  ({ today: renderToday, explore: renderExplore, saved: renderSaved, progress: renderProgress })[view()]();
  icons();
}

function getQuestions(topic) {
  if (topic === 'math') return Array.from({ length: 5 }, (_, index) => mathQuestion(Math.random, index));
  if (topic === 'music') return selectQuestions(musicQuestions(clef), progress);
  if (topic === 'mix') {
    const surprise = topics.filter(item => !['programming', 'music', 'math'].includes(item.id));
    const extra = surprise[dayNumber % surprise.length].id;
    return shuffle([...selectQuestions(questions.programming, progress, 2), ...selectQuestions(musicQuestions(clef), progress, 1), mathQuestion(), ...selectQuestions(questions[extra], progress, 1)]);
  }
  return selectQuestions(questions[topic], progress);
}

function startSession(topic) {
  readerDialog.close();
  session = { topic, questions: getQuestions(topic), index: 0, answers: [], selected: null, completed: false };
  renderQuestion();
  if (!lessonDialog.open) lessonDialog.showModal();
}

function staff(question) {
  const bottom = 122;
  const noteY = bottom + 16 - question.position * 8;
  const downward = question.position >= 6;
  const stemX = downward ? 196 : 214;
  const stemEnd = noteY + (downward ? 42 : -42);
  const ledger = [];
  if (noteY > bottom) for (let height = bottom + 16; height <= noteY; height += 16) ledger.push(height);
  if (noteY < bottom - 64) for (let height = bottom - 80; height >= noteY; height -= 16) ledger.push(height);
  return `<div class="staff-wrap"><svg class="staff" viewBox="0 0 370 165" role="img" aria-label="Nuta na pięciolinii w kluczu ${question.clef === 'bass' ? 'basowym' : 'wiolinowym'}"><g stroke="currentColor" stroke-width="1.3">${Array.from({ length: 5 }, (_, index) => `<line x1="20" x2="350" y1="${bottom - index * 16}" y2="${bottom - index * 16}"/>`).join('')}${ledger.map(height => `<line x1="188" x2="222" y1="${height}" y2="${height}"/>`).join('')}</g>${question.clef === 'bass' ? '<path d="M43 72c-8-20 31-25 30 0-1 21-19 34-37 41 13-12 27-25 27-39 0-10-9-17-17-10" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="44" cy="71" r="5"/><circle cx="81" cy="66" r="2.5"/><circle cx="81" cy="82" r="2.5"/>' : '<path d="M57 146C34 149 46 124 55 141M58 145L48 33C46 11 69 20 61 42C56 57 29 69 35 94C40 114 72 115 74 96C76 77 46 72 44 93C43 101 50 109 57 108" fill="none" stroke="currentColor" stroke-width="3.5"/>'}<ellipse cx="205" cy="${noteY}" rx="10" ry="6.7" transform="rotate(-18 205 ${noteY})" fill="currentColor"/><line x1="${stemX}" x2="${stemX}" y1="${noteY}" y2="${stemEnd}" stroke="currentColor" stroke-width="2"/></svg><div class="clef-label">Klucz ${question.clef === 'bass' ? 'basowy' : 'wiolinowy'} · polskie nazwy nut</div></div>`;
}

function renderQuestion() {
  const current = session.questions[session.index];
  const chosen = session.selected;
  const isAnswered = chosen !== null;
  const isCorrect = chosen === current.answer;
  const topic = topicFor(session.topic);
  lessonDialog.innerHTML = `<div class="dialog-top"><span class="dialog-top-label">${icon(topic?.icon || 'sparkles')}${topic?.name || 'Codzienny mix'}</span><button class="icon-button" data-action="close-lesson" aria-label="Zamknij trening" title="Zamknij trening">${icon('x')}</button></div><div class="lesson-content"><div class="question-meta"><span>Pytanie ${session.index + 1} z ${session.questions.length}</span><span>Bez pośpiechu.</span></div><div class="quiz-track"><span style="width:${session.index / session.questions.length * 100}%"></span></div><h2 id="lesson-title">${escape(current.prompt)}</h2>${current.code ? `<pre><code>${escape(current.code)}</code></pre>` : ''}${current.kind === 'note' ? staff(current) : ''}<div class="answers ${current.kind === 'note' ? 'music-options' : ''}">${current.options.map((option, index) => `<button class="answer ${isAnswered && option === current.answer ? 'correct' : ''} ${isAnswered && option === chosen && !isCorrect ? 'wrong' : ''}" data-answer="${index}" ${isAnswered ? 'disabled' : ''}>${current.kind === 'note' ? '' : `<span class="answer-index">${index + 1}</span>`}<span>${escape(option)}</span>${isAnswered && option === current.answer ? icon('check') : ''}</button>`).join('')}</div>${isAnswered ? `<div class="feedback ${isCorrect ? '' : 'wrong'}" role="status"><strong>${isCorrect ? 'Właśnie tak! +10 XP' : 'To dobra okazja, żeby zapamiętać.'}</strong>${escape(current.explanation)}</div><div class="continue-row"><button class="primary" data-action="next">${session.index === session.questions.length - 1 ? 'Zobacz wynik' : 'Dalej'} ${icon('arrow-right')}</button></div>` : ''}</div>`;
  icons();
  if (isAnswered) lessonDialog.querySelector('[data-action="next"]').focus({ preventScroll: true });
}

function answerQuestion(index) {
  if (!session || session.selected !== null || session.completed) return;
  const current = session.questions[session.index];
  const selected = current.options[index];
  if (selected === undefined) return;
  session.selected = selected;
  session.answers.push({ id: current.id, correct: selected === current.answer });
  renderQuestion();
}

function nextQuestion() {
  if (!session || session.selected === null || session.completed) return;
  if (session.index < session.questions.length - 1) {
    session.index++;
    session.selected = null;
    renderQuestion();
    lessonDialog.scrollTop = 0;
    lessonDialog.querySelector('.answer')?.focus({ preventScroll: true });
  } else {
    session.completed = true;
    progress = recordSession(progress, session.topic, session.answers);
    store(STORAGE_KEY, progress);
    render();
    renderResult();
  }
}

function renderResult() {
  const correct = session.answers.filter(answer => answer.correct).length;
  lessonDialog.innerHTML = `<div class="dialog-top"><span class="dialog-top-label">${icon('check-check')}Trening ukończony</span><button class="icon-button" data-action="close-lesson" aria-label="Zamknij wynik">${icon('x')}</button></div><div class="result"><div class="result-icon">${icon('trophy')}</div><h2 id="lesson-title">Chwila dobrze wykorzystana.</h2><p>${correct === session.questions.length ? 'Wszystkie odpowiedzi trafione. Pięknie!' : 'Nie trzeba wiedzieć wszystkiego. Ważne, że wiesz już trochę więcej.'}</p><div class="result-stats"><div><strong>+${correct * 10 + 5}</strong><span>XP zdobyte</span></div><div><strong>${correct}/${session.questions.length}</strong><span>poprawnych odpowiedzi</span></div><div><strong>${streak(progress)}</strong><span>dni w serii</span></div></div><div class="result-buttons"><button class="secondary" data-action="again">${icon('rotate-ccw')}Jeszcze raz</button><button class="primary" data-action="close-lesson">Na dziś wystarczy ${icon('check')}</button></div></div>`;
  icons();
  lessonDialog.querySelector('[data-action="close-lesson"]')?.focus({ preventScroll: true });
}

function closeLesson() {
  if (session && !session.completed && session.answers.length && !confirm('Zakończyć trening? Nieukończona sesja nie zapisze punktów.')) return;
  lessonDialog.close();
  session = null;
}

function saveArticle(id) {
  if (!articles.some(article => article.id === id)) return;
  const removing = saved.includes(id);
  saved = removing ? saved.filter(item => item !== id) : [...saved, id];
  store('njudy-saved-v1', saved);
  render();
  if (readerDialog.open && readerDialog.dataset.article === id) openArticle(id, false);
  toast(removing ? 'Usunięto z zapisanych.' : 'Dobry pomysł zostaje na później.');
}

function openArticle(id, show = true) {
  const article = articles.find(item => item.id === id);
  if (!article) return;
  const topic = topicFor(article.topic);
  readerDialog.dataset.article = id;
  readerDialog.innerHTML = `<div class="dialog-top"><span class="dialog-top-label">${icon(topic.icon)}${topic.name} · ${article.minutes} min</span><button class="icon-button" data-action="close-reader" aria-label="Zamknij tekst">${icon('x')}</button></div><article class="reader-content"><div class="mini-label">MAŁA RZECZ DO PRZEMYŚLENIA</div><h2 id="reader-title">${article.title}</h2><div class="reader-subtitle">${article.subtitle}</div>${article.id === 'light' ? `<img class="reader-image" src="./artwork.jpg" alt="Vincent van Gogh, Wheat Field with Cypresses, 1889" />` : ''}${article.paragraphs.map(([title, paragraph]) => `<h3>${title}</h3><p>${paragraph}</p>`).join('')}<a class="source" href="${article.source}" target="_blank" rel="noopener noreferrer">${icon('external-link')}Źródło i dalsza lektura: ${article.sourceLabel}</a><div class="reader-actions result-buttons"><button class="secondary" data-save="${article.id}">${icon('bookmark')}${saved.includes(id) ? 'Usuń z zapisanych' : 'Zapisz na później'}</button><button class="primary" data-topic="${article.topic}">Mały trening ${icon('arrow-right')}</button></div></article>`;
  icons();
  if (show) { readerDialog.showModal(); readerDialog.scrollTop = 0; }
}

function openWord() {
  delete readerDialog.dataset.article;
  readerDialog.innerHTML = `<div class="dialog-top"><span class="dialog-top-label">${icon('languages')}Słowo na dziś</span><button class="icon-button" data-action="close-reader" aria-label="Zamknij słowo">${icon('x')}</button></div><article class="reader-content"><div class="mini-label">${wordInfo.live ? 'FREE DICTIONARY API' : 'BIBLIOTEKA OFFLINE'}</div><h2 id="reader-title">${escape(wordInfo.word)}</h2><div class="reader-subtitle">${escape(wordInfo.phonetic)} · ${escape(wordInfo.translation)}</div><p>${escape(wordInfo.definition)}</p><h3>Twoje własne zdanie</h3><p>Użyj tego słowa w jednym zdaniu o swoim dniu. Wypowiedz je na głos, zanim pójdziesz dalej.</p><div class="reader-actions result-buttons"><button class="secondary" data-action="speak">${icon('volume-2')}Posłuchaj</button><button class="primary" data-topic="english">Poćwicz angielski ${icon('arrow-right')}</button></div><a class="source" href="https://en.wiktionary.org/wiki/${encodeURIComponent(dailyWord)}" target="_blank" rel="noopener noreferrer">${icon('external-link')}Wiktionary · ${escape(dailyWord)}</a></article>`;
  icons();
  readerDialog.showModal();
  readerDialog.scrollTop = 0;
}

function openArt() {
  delete readerDialog.dataset.article;
  readerDialog.innerHTML = `<div class="dialog-top"><span class="dialog-top-label">${icon('palette')}Przerwa na patrzenie</span><button class="icon-button" data-action="close-reader" aria-label="Zamknij obraz">${icon('x')}</button></div><article class="reader-content"><div class="mini-label">THE MET · KOLEKCJA PUBLIC DOMAIN</div><h2 id="reader-title">${escape(artInfo.title)}</h2><div class="reader-subtitle">${escape(artInfo.artist)} · ${escape(artInfo.date)}</div><img class="reader-image" src="${escape(artInfo.image)}" alt="${escape(artInfo.title)}" /><h3>Jeden obraz. Trzy spojrzenia.</h3><p>Gdzie najpierw wędruje twój wzrok? Jaki kolor łączy kompozycję? Co zauważasz dopiero za drugim razem?</p><div class="reader-actions result-buttons"><button class="secondary" data-action="new-art" ${artLoading ? 'disabled' : ''}>${icon('refresh-cw')}${artLoading ? 'Szukam obrazu…' : 'Inny obraz'}</button><button class="primary" data-topic="art">Mały trening ${icon('arrow-right')}</button></div><a class="source" href="${escape(artInfo.url)}" target="_blank" rel="noopener noreferrer">${icon('external-link')}Zobacz dzieło w kolekcji The Metropolitan Museum of Art</a><p style="font-size:11px;margin-top:12px">${artInfo.live ? 'Obraz pobrany z otwartego API muzeum.' : 'Obraz z biblioteki offline. Inne dzieła wymagają internetu.'}</p></article>`;
  icons();
  if (!readerDialog.open) readerDialog.showModal();
  readerDialog.scrollTop = 0;
}

async function fetchJSON(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(6500) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function fetchWord() {
  const cached = readJSON(`njudy-word-${dailyWord}`, null);
  if (cached && typeof cached.definition === 'string' && cached.definition.length < 2000) {
    wordInfo = { ...wordInfo, definition: cached.definition, phonetic: typeof cached.phonetic === 'string' ? cached.phonetic : '', audio: safeURL(cached.audio), licenseName: typeof cached.licenseName === 'string' ? cached.licenseName : '', licenseURL: safeURL(cached.licenseURL), live: true };
    refreshDiscovery();
  }
  if (!navigator.onLine) return;
  try {
    const entries = await fetchJSON(`https://api.dictionaryapi.dev/api/v2/entries/en/${dailyWord}`);
    const entry = entries[0];
    const firstDefinition = entry?.meanings?.[0]?.definitions?.[0];
    const definition = firstDefinition?.definition;
    if (typeof definition !== 'string') return;
    const license = firstDefinition.license || entry.license;
    wordInfo = { ...wordInfo, definition: definition.slice(0, 2000), phonetic: typeof entry.phonetic === 'string' ? entry.phonetic : '', audio: safeURL(entry.phonetics?.find(item => item.audio)?.audio), licenseName: typeof license?.name === 'string' ? license.name : '', licenseURL: safeURL(license?.url), live: true };
    store(`njudy-word-${dailyWord}`, { definition: wordInfo.definition, phonetic: wordInfo.phonetic, audio: wordInfo.audio, licenseName: wordInfo.licenseName, licenseURL: wordInfo.licenseURL });
    refreshDiscovery();
  } catch {}
}

function refreshDiscovery() {
  const feed = document.querySelector('#discovery-feed');
  if (feed) { feed.innerHTML = renderDiscovery(); icons(); }
}

async function newArt() {
  if (artLoading) return;
  if (!navigator.onLine) { toast('Jesteś offline. Dzisiejszy obraz nadal jest dostępny.'); return; }
  artLoading = true;
  openArt();
  try {
    const objectIds = [436535, 437133, 436105, 436121, 435882, 436532];
    const object = await fetchJSON(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIds[Math.floor(Math.random() * objectIds.length)]}`);
    const image = safeURL(object.primaryImageSmall || object.primaryImage);
    if (!image || !object.isPublicDomain) throw new Error('No public-domain image');
    const picture = new Image();
    picture.src = image;
    await Promise.race([picture.decode(), new Promise((_, reject) => setTimeout(() => reject(new Error('Image timeout')), 7000))]);
    artInfo = { title: String(object.title || 'Bez tytułu'), artist: String(object.artistDisplayName || 'Autor nieznany'), date: String(object.objectDate || ''), image, url: safeURL(object.objectURL) || artInfo.url, live: true };
    refreshDiscovery();
  } catch { toast('Muzeum jest teraz niedostępne. Zostajemy przy obrazie offline.'); }
  finally {
    artLoading = false;
    if (readerDialog.open && readerDialog.querySelector('[data-action="new-art"]')) openArt();
  }
}

async function speak() {
  if (wordInfo.audio && navigator.onLine) {
    try { await new Audio(wordInfo.audio).play(); return; } catch {}
  }
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(dailyWord);
    utterance.lang = 'en-GB';
    utterance.rate = 0.85;
    utterance.onerror = () => toast('Wymowa jest niedostępna na tym urządzeniu.');
    speechSynthesis.speak(utterance);
  } else toast('Twoja przeglądarka nie udostępnia wymowy.');
}

function openSettings() {
  settingsDialog.innerHTML = `<div class="dialog-top"><span class="dialog-top-label" id="settings-title">${icon('sliders-horizontal')}Twój rytm</span><button class="icon-button" data-action="close-settings" aria-label="Zamknij ustawienia">${icon('x')}</button></div><div class="settings-content"><h3>Dzienny cel</h3><p>Krótko i regularnie. Dopasuj cel do swojego dnia.</p><div class="segmented" role="group" aria-label="Liczba treningów dziennie">${[1, 3, 5].map(goal => `<button data-goal="${goal}" aria-pressed="${progress.goal === goal}">${goal} ${goal === 1 ? 'trening' : goal === 3 ? 'treningi' : 'treningów'}</button>`).join('')}</div><h3>Nuty</h3><label class="sr-only" for="clef">Klucz muzyczny</label><select id="clef" class="clef-select"><option value="treble" ${clef === 'treble' ? 'selected' : ''}>Klucz wiolinowy</option><option value="bass" ${clef === 'bass' ? 'selected' : ''}>Klucz basowy</option></select><h3>Twoje dane są twoje</h3><p>Postęp i zapisane teksty pozostają w tej przeglądarce. Bez konta i bez wysyłania wyników. Czyszczenie danych przeglądarki usuwa postęp.</p><div class="settings-actions"><button class="secondary" data-action="export">${icon('download')}Eksportuj</button><button class="secondary" data-action="import">${icon('plus')}Importuj</button><button class="secondary danger" data-action="reset">${icon('trash-2')}Wyczyść postęp</button></div><input type="file" id="import-file" accept="application/json,.json" hidden /><div class="install-help"><h3>Njudy na ekranie telefonu</h3><p>${installPrompt ? 'Zainstaluj aplikację, żeby wracać do niej jednym dotknięciem.' : 'iPhone: otwórz w Safari → Udostępnij → Do ekranu początkowego. Android: menu przeglądarki → Zainstaluj aplikację. Opcja pojawia się na HTTPS po pierwszym otwarciu.'}</p>${installPrompt ? `<button class="primary" data-action="install" style="margin-top:15px">${icon('download')}Zainstaluj Njudy</button>` : ''}</div></div>`;
  icons();
  if (!settingsDialog.open) settingsDialog.showModal();
}

function exportData() {
  const blob = new Blob([JSON.stringify({ version: 1, progress, saved, clef }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `njudy-${dateKey()}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function importData(file) {
  if (!file) return;
  try {
    if (file.size > 1_000_000) throw new Error('Too large');
    const data = JSON.parse(await file.text());
    if (data.version !== 1 || !data.progress || !Array.isArray(data.saved)) throw new Error('Invalid backup');
    if (!confirm('Zastąpić obecny postęp danymi z pliku?')) return;
    progress = loadProgress({ getItem: () => JSON.stringify(data.progress) });
    saved = [...new Set(data.saved)].filter(id => articles.some(article => article.id === id));
    clef = data.clef === 'bass' ? 'bass' : 'treble';
    store(STORAGE_KEY, progress);
    store('njudy-saved-v1', saved);
    store('njudy-clef-v1', clef);
    render();
    openSettings();
    toast('Kopia przywrócona. Możesz wracać do nauki.');
  } catch { toast('Nie udało się odczytać kopii Njudy. Wybierz poprawny plik JSON.'); }
}

document.addEventListener('click', async event => {
  const target = event.target.closest('button, a');
  if (!target) return;
  if (target.dataset.topic) startSession(target.dataset.topic);
  if (target.dataset.answer !== undefined) answerQuestion(Number(target.dataset.answer));
  if (target.dataset.article) { event.preventDefault(); openArticle(target.dataset.article); }
  if (target.dataset.save) saveArticle(target.dataset.save);
  if (target.dataset.filter) { filter = target.dataset.filter; render(); }
  if (target.dataset.goal) { progress.goal = Number(target.dataset.goal); store(STORAGE_KEY, progress); render(); openSettings(); }
  const action = target.dataset.action;
  if (action === 'next') nextQuestion();
  if (action === 'close-lesson') closeLesson();
  if (action === 'again' && session) startSession(session.topic);
  if (action === 'close-reader') readerDialog.close();
  if (action === 'settings') openSettings();
  if (action === 'close-settings') settingsDialog.close();
  if (action === 'word') openWord();
  if (action === 'art') openArt();
  if (action === 'new-art') await newArt();
  if (action === 'speak') await speak();
  if (action === 'export') exportData();
  if (action === 'import') document.querySelector('#import-file').click();
  if (action === 'reset' && confirm('Usunąć cały postęp i zapisane teksty? Tej operacji nie można cofnąć bez kopii.')) {
    progress = emptyProgress(); saved = [];
    store(STORAGE_KEY, progress); store('njudy-saved-v1', saved);
    render(); openSettings(); toast('Nowy początek. Bez presji.');
  }
  if (action === 'install' && installPrompt) {
    await installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    openSettings();
  }
});

document.addEventListener('change', event => {
  if (event.target.id === 'clef') { clef = event.target.value; store('njudy-clef-v1', clef); toast('Zapisano klucz muzyczny.'); }
  if (event.target.id === 'import-file') importData(event.target.files[0]);
});
lessonDialog.addEventListener('cancel', event => { event.preventDefault(); closeLesson(); });
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); main.focus({ preventScroll: true }); });
window.addEventListener('offline', () => { header(); toast('Offline? Treningi i teksty nadal są z tobą.'); });
window.addEventListener('online', () => { header(); fetchWord(); });
window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installPrompt = event; });
window.addEventListener('appinstalled', () => { installPrompt = null; toast('Njudy jest na twoim ekranie.'); });
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') render(); });

render();
fetchWord();
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => toast('Nie udało się przygotować trybu offline. Spróbuj ponownie online.'));
  });
}