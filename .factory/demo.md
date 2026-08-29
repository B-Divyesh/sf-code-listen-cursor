# Demo sandbox

Open `/demo/` (or `/?demo=1`) for the one-click sample workspace. It ships an editable JavaScript sample about a fern and immediately shows the code-to-speech preview.

The demo writes only the `demo:code-listen-cursor:pronunciation` local-storage key, and only after a sample pronunciation is saved. **Reset demo** removes that key and restores the shipped code and controls. **Start for real** returns to `/`; it never reads or writes demo data.

After the first visit, the service worker caches the `/demo/` shell for the offline claim. Speech requires a voice the browser or operating system marks as local. If none exists, no utterance starts and the spoken preview stays available.
