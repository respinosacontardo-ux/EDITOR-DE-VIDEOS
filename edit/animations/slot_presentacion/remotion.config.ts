import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

// Use a system Chromium/Chrome when provided (e.g. sandboxed environments
// where Remotion cannot download its own headless shell). Otherwise
// Remotion downloads its free headless browser on first render.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
if (process.env.REMOTION_CHROME_MODE) {
  Config.setChromeMode(
    process.env.REMOTION_CHROME_MODE as 'headless-shell' | 'chrome-for-testing',
  );
}
