/**
 * Static pages still need a clear destination for keyboard and screen-reader
 * visitors. Moving focus only after an in-site navigation preserves the skip
 * link as the first target for a cold visit.
 */
function arrivedFromThisSite(): boolean {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  return document.referrer.startsWith(location.origin) || navigation?.type === 'back_forward';
}

function announceDestination(): void {
  const heading = document.querySelector<HTMLElement>('main h1');
  const announcement = document.getElementById('route-announcement');
  if (!heading || !announcement) return;

  heading.tabIndex = -1;
  announcement.textContent = `Opened ${heading.textContent?.trim() ?? 'page'}`;
  heading.focus({ preventScroll: true });
}

if (arrivedFromThisSite()) {
  requestAnimationFrame(announceDestination);
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted || arrivedFromThisSite()) requestAnimationFrame(announceDestination);
});
