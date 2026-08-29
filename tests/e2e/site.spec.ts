import AxeBuilder from '@axe-core/playwright';
import { expect, test } from 'playwright/test';

test('landing page has its core content and no serious accessibility violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle(/Code Listen Cursor/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Listen to code without losing your place' })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toHaveAttribute('href', '#main');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('@regression:landing-privacy-navigation keeps Privacy in the desktop and mobile header', async ({ page }) => {
  await page.goto('/');
  const privacy = page.getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Privacy' });
  await expect(privacy).toBeVisible();
  await expect(privacy).toHaveAttribute('href', '/privacy/');
  const bounds = await privacy.boundingBox();
  expect(bounds?.width).toBeGreaterThanOrEqual(44);
  expect(bounds?.height).toBeGreaterThanOrEqual(44);
  await privacy.click();
  await expect(page).toHaveURL(/\/privacy\/$/);
  const privacyHeading = page.getByRole('heading', { level: 1, name: 'Privacy' });
  await expect(privacyHeading).toBeVisible();
  await expect(privacyHeading).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Opened Privacy');
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  const homeHeading = page.getByRole('heading', { level: 1, name: 'Listen to code without losing your place' });
  await expect(homeHeading).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Opened Listen to code without losing your place');
});

test('@claim:demo-reader reads a selection or current line with chosen pronunciation', async ({ page }) => {
  await page.goto('/#field-station');
  const editor = page.getByLabel('Editable code sample');
  await editor.fill('const kubectl = fern?.name;');
  await editor.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(6, 13));
  await editor.press('ArrowRight');
  await page.getByLabel('Code word').fill('kubectl');
  await page.getByLabel('Speak as').fill('cube control');
  await page.getByRole('button', { name: 'Save sample pronunciation' }).click();
  await expect(page.getByLabel('Words that will be spoken')).toContainText('cube control');
  await editor.evaluate((element: HTMLTextAreaElement) => element.setSelectionRange(20, 20));
  await editor.press('ArrowLeft');
  await expect(page.getByLabel('Words that will be spoken')).toContainText('fern optional dot name');
});

test('demo route, query entry, keyboard path, and mobile-safe controls work', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo\/$/);
  const demoHeading = page.getByRole('heading', { name: 'Listen to sample code' });
  await expect(demoHeading).toBeVisible();
  await expect(demoHeading).toBeFocused();
  await expect(page.locator('#route-announcement')).toHaveText('Opened Listen to sample code');
  await page.getByLabel('Editable sample code').focus();
  await page.keyboard.press('Control+A');
  await page.keyboard.type('const leaf = 1;');
  await page.getByRole('button', { name: 'Listen to code' }).press('Enter');
  await expect(page.getByLabel('Words that will be spoken')).toContainText('const leaf gets 1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test('all routes have landmarks, one h1, and no axe violations', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  for (const path of ['/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('designed 404 document gives a way back', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.getByRole('heading', { name: 'This page was not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/');
});

test('@regression:touch-targets every visible interactive target is at least 44px', async ({ page }) => {
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const small = await page.locator('a:visible,button:visible,input:visible,select:visible,summary:visible,textarea:visible').evaluateAll((elements) => (
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return { label: element.textContent?.trim() || element.getAttribute('aria-label') || element.id, width: box.width, height: box.height };
      }).filter((box) => box.width < 44 || box.height < 44)
    ));
    expect(small, `${path} contains undersized targets`).toEqual([]);
  }
});

test('@regression:zoom-reflow keeps every route and navigation inside 195 CSS px', async ({ page }) => {
  await page.setViewportSize({ width: 195, height: 844 });
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const layout = await page.evaluate(() => {
      const targets = [...document.querySelectorAll<HTMLElement>('a,button,input,select,summary,textarea')]
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => {
          const box = element.getBoundingClientRect();
          return { label: element.textContent?.trim() || element.getAttribute('aria-label') || element.id, width: box.width, height: box.height };
        })
        .filter((box) => box.width < 44 || box.height < 44);
      return {
        innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        smallTargets: targets
      };
    });
    expect(layout.scrollWidth, `${path} overflows at the 390px/200% reflow proxy`).toBeLessThanOrEqual(layout.innerWidth);
    expect(layout.smallTargets, `${path} has an undersized target at 200% reflow`).toEqual([]);
    const privacy = page.locator('header nav[aria-label="Primary navigation"] a[href="/privacy/"]');
    await expect(privacy, `${path} must retain its Privacy navigation link`).toHaveCount(1);
    await expect(privacy, `${path} must keep Privacy inside the viewport`).toBeInViewport();
  }
});

test('@regression:spoken-preview-keyboard-scroll supports overflowing words at 390px and 200% reflow', async ({ page }) => {
  const longLine = 'const fernSpecimenWithAnUnusuallyLongIdentifier = botanicalNotebook?.observations?.filter((observation) => observation.frondMeasurement >= 3).map((observation) => observation.growthDescription).join("_");';
  const scenarios = [
    { path: '/demo/', viewport: { width: 390, height: 844 }, code: longLine },
    { path: '/', viewport: { width: 195, height: 844 } }
  ];

  for (const scenario of scenarios) {
    await page.setViewportSize(scenario.viewport);
    await page.goto(scenario.path);
    const editor = page.locator('#code-sample');
    await expect(editor).toBeVisible();
    if (scenario.code) await editor.fill(scenario.code);
    await editor.press('End');
    await page.getByRole('button', { name: 'Listen to code' }).click();

    const preview = page.getByRole('region', { name: 'Words that will be spoken' });
    if (scenario.code) await expect(preview).toContainText('fern Specimen With An Unusually Long Identifier');
    await expect(preview).toHaveAttribute('aria-describedby', 'speech-preview-help');
    const metrics = await preview.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      tabIndex: element.tabIndex
    }));
    expect(metrics.scrollHeight, `${scenario.path} must overflow at ${scenario.viewport.width}px`).toBeGreaterThan(metrics.clientHeight);
    expect(metrics.tabIndex).toBe(0);

    await page.getByRole('button', { name: 'Listen to code' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Stop' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(preview).toBeFocused();
    await expect(preview).toHaveCSS('outline-style', 'solid');
    const scrollTop = await preview.evaluate((element) => element.scrollTop);
    await page.keyboard.press('PageDown');
    await expect.poll(() => preview.evaluate((element) => element.scrollTop)).toBeGreaterThan(scrollTop);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  }
});

test('@regression:low-vision-type keeps visible site copy at 16px or larger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/demo/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    const tooSmall = await page.locator('body').evaluate((body) => (
      [...body.querySelectorAll<HTMLElement>('*')]
        .filter((element) => element.getClientRects().length > 0)
        .filter((element) => [...element.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()))
        .map((element) => ({
          element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.className ? `.${String(element.className).replaceAll(' ', '.')}` : ''}`,
          size: Number.parseFloat(getComputedStyle(element).fontSize),
          text: element.textContent?.trim().slice(0, 60)
        }))
        .filter(({ size }) => size < 16)
    ));
    expect(tooSmall, `${path} contains text below 16px`).toEqual([]);
  }
});

test('@regression:focus-contrast focus rings clear 3:1 on paper and dark reader surfaces', async ({ page }) => {
  await page.goto('/');
  const contrast = await page.evaluate(() => {
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
      const linear = channels.map((value) => {
        const normalized = value / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return (linear[0] ?? 0) * 0.2126 + (linear[1] ?? 0) * 0.7152 + (linear[2] ?? 0) * 0.0722;
    };
    const ratio = (one: string, two: string) => {
      const [lighter, darker] = [luminance(one), luminance(two)].sort((a, b) => b - a);
      return (lighter + 0.05) / (darker + 0.05);
    };
    const link = document.querySelector<HTMLAnchorElement>('.wordmark')!;
    const readerButton = document.querySelector<HTMLButtonElement>('#demo-listen')!;
    link.focus();
    const paperRing = getComputedStyle(link).outlineColor;
    readerButton.focus();
    const darkRing = getComputedStyle(readerButton).outlineColor;
    return {
      paper: ratio(paperRing, getComputedStyle(document.body).backgroundColor),
      dark: ratio(darkRing, getComputedStyle(document.querySelector('.field-station')!).backgroundColor)
    };
  });
  expect(contrast.paper).toBeGreaterThanOrEqual(3);
  expect(contrast.dark).toBeGreaterThanOrEqual(3);
});
