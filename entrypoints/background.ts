import { browser } from 'wxt/browser';
import type { CursorCommand } from '../core/messages';

const commandMap: Record<string, CursorCommand> = {
  'listen-code': { type: 'LISTEN' },
  'repeat-code': { type: 'REPEAT' },
  'toggle-follow': { type: 'TOGGLE_FOLLOW' },
  'stop-speaking': { type: 'STOP' }
};

async function sendToActive(message: CursorCommand): Promise<void> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  try {
    await browser.tabs.sendMessage(tab.id, message);
  } catch {
    // Restricted browser pages cannot host content scripts. The popup explains this state.
  }
}

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: 'listen-selection',
      title: 'Listen to selected code',
      contexts: ['selection']
    });
  });

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'listen-selection') void sendToActive({ type: 'LISTEN' });
  });

  browser.commands.onCommand.addListener((command) => {
    const message = commandMap[command];
    if (message) void sendToActive(message);
  });
});
