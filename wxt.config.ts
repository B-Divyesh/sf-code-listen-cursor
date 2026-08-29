import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  outDir: '.output',
  manifest: {
    name: 'Code Listen Cursor',
    description: 'Read selected code or the current line with structure-aware, local speech.',
    version: '1.0.1',
    permissions: ['storage', 'activeTab', 'contextMenus'],
    commands: {
      'listen-code': {
        suggested_key: { default: 'Alt+Shift+S', mac: 'Alt+Shift+S' },
        description: 'Listen to selected code or the current line'
      },
      'repeat-code': {
        suggested_key: { default: 'Alt+Shift+R', mac: 'Alt+Shift+R' },
        description: 'Repeat the last spoken code'
      },
      'toggle-follow': {
        suggested_key: { default: 'Alt+Shift+F', mac: 'Alt+Shift+F' },
        description: 'Toggle cursor follow'
      },
      'stop-speaking': {
        suggested_key: { default: 'Alt+Shift+X', mac: 'Alt+Shift+X' },
        description: 'Stop speaking'
      }
    },
    action: { default_title: 'Code Listen Cursor' },
    icons: {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
      48: 'icons/icon-48.png',
      128: 'icons/icon-128.png'
    }
  }
});
