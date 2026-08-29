/**
 * WXT generates richer versions of these declarations during its own build.
 * Keeping this small source declaration makes `npx tsc --noEmit` usable in a
 * freshly cloned repository, before WXT has created `.wxt/`.
 */
declare function defineBackground(main: () => void): unknown;

declare function defineContentScript(config: {
  matches: string[];
  main: () => void;
}): unknown;
