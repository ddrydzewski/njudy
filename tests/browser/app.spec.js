import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://api.dictionaryapi.dev/**', route => route.abort());
  await page.goto('./');
});

test('home is responsive, all eight paths work and artwork renders', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await expect(page.locator('.topic')).toHaveCount(8);
  await expect(page.locator('h1')).toContainText('Daj głowie');
  await expect.poll(() => page.locator('.art-image').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-home.png`, fullPage: true });
  for (const topic of ['programming', 'music', 'english', 'math', 'art', 'philosophy', 'economics', 'curiosity']) {
    await page.locator(`[data-topic="${topic}"]`).first().click();
    await expect(page.locator('#lesson-dialog')).toBeVisible();
    await expect(page.locator('.answer')).not.toHaveCount(0);
    await page.locator('[data-action="close-lesson"]').click();
  }
  expect(errors).toEqual([]);
});

test('complete a session, award XP once and persist after reload', async ({ page }) => {
  await page.locator('[data-topic="math"]').click();
  let correct = 0;
  for (let index = 0; index < 5; index++) {
    await page.locator('.answer').first().click();
    await expect(page.locator('.feedback')).toBeVisible();
    if (await page.locator('.feedback').getAttribute('class') === 'feedback ') correct++;
    await expect(page.locator('.answer:disabled')).toHaveCount(4);
    await page.locator('[data-action="next"]').click();
  }
  await expect(page.locator('.result')).toBeVisible();
  const data = await page.evaluate(() => JSON.parse(localStorage.getItem('njudy-progress-v1')));
  expect(data.sessions).toBe(1);
  expect(data.answered).toBe(5);
  expect(data.correct).toBe(correct);
  expect(data.xp).toBe(correct * 10 + 5);
  await page.locator('.result [data-action="close-lesson"]').click();
  await page.reload();
  await page.locator('[data-view="progress"]').click();
  await expect(page.locator('.stat').nth(2).locator('strong')).toHaveText('1');
});

test('save, read, filter and remove an article', async ({ page }) => {
  await page.locator('[data-view="explore"]').click();
  await page.locator('[data-filter="programming"]').click();
  await expect(page.locator('.article-tile')).toHaveCount(1);
  await page.locator('[data-save="deep"]').click();
  await page.locator('[data-view="saved"]').click();
  await expect(page.locator('.article-tile')).toHaveCount(1);
  await page.locator('.article-tile h3 a').click();
  await expect(page.locator('#reader-title')).toContainText('Mniej przycisków');
  await page.locator('#reader-dialog [data-save="deep"]').click();
  await page.locator('[data-action="close-reader"]').click();
  await expect(page.locator('.empty-state')).toBeVisible();
});

test('settings persist and bass clef training works', async ({ page }) => {
  await page.locator('.avatar').click();
  await page.locator('[data-goal="1"]').click();
  await page.locator('#clef').selectOption('bass');
  await page.locator('[data-action="close-settings"]').click();
  await page.reload();
  await expect(page.locator('.goal-label strong')).toHaveText('0 / 1 treningów');
  await page.locator('[data-topic="music"]').click();
  await expect(page.locator('.clef-label')).toContainText('basowy');
  await expect(page.locator('.answer')).toHaveCount(7);
  await page.locator('.answer').first().click();
  await expect(page.locator('.feedback')).toBeVisible();
});

test('PWA installs cache and reloads with lessons and artwork offline', async ({ page, context, baseURL }) => {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  const manifest = await page.request.get('./manifest.webmanifest');
  const data = await manifest.json();
  expect(data.display).toBe('standalone');
  for (const item of data.icons) {
    const response = await page.request.get(new URL(item.src, baseURL).href);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  }
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.topic')).toHaveCount(8);
  await expect.poll(() => page.locator('.art-image').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.locator('[data-topic="programming"]').click();
  await page.locator('.answer').first().click();
  await expect(page.locator('.feedback')).toBeVisible();
  await context.setOffline(false);
});

test('dictionary API text is safely rendered and unreachable museum is handled', async ({ page }) => {
  await page.route('https://api.dictionaryapi.dev/**', route => route.fulfill({ json: [{ meanings: [{ definitions: [{ definition: '<img src=x onerror=alert(1)>' }] }], phonetic: '/test/', license: { name: 'CC BY-SA 3.0', url: 'https://creativecommons.org/licenses/by-sa/3.0/' } }] }));
  await page.reload();
  await expect(page.locator('.word-definition')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('.word-definition img')).toHaveCount(0);
  await expect(page.locator('.api-credit')).toContainText('CC BY-SA 3.0');
  await page.route('https://collectionapi.metmuseum.org/**', route => route.abort());
  await page.locator('[data-action="art"]').click();
  await page.locator('[data-action="new-art"]').click();
  await expect(page.locator('#toast')).toContainText('Muzeum jest teraz niedostępne');
  await expect(page.locator('[data-action="new-art"]')).toBeEnabled();
});