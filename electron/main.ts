import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { createWindow } from './window';

async function onReady() {
  ipcMain.handle('open-external', async (_event, value: unknown) => {
    const url = requireHttpsUrl(value);
    await shell.openExternal(url);
  });
  ipcMain.handle('check-url', async (_event, value: unknown) => checkUrl(requireHttpsUrl(value)));
  createWindow();
}

app.whenReady().then(onReady);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function requireHttpsUrl(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Invalid URL');
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Only HTTPS links are allowed');
  return url.toString();
}

async function checkUrl(url: string): Promise<{ status: number; ok: boolean }> {
  const check = (method: 'HEAD' | 'GET') => fetch(url, {
    method,
    headers: method === 'GET' ? { Range: 'bytes=0-0' } : undefined,
    redirect: 'follow',
    signal: AbortSignal.timeout(7000),
  });
  let response: Response;
  try {
    response = await check('HEAD');
    if (response.status === 405 || response.status === 501) response = await check('GET');
  } catch {
    response = await check('GET');
  }
  return { status: response.status, ok: response.ok };
}
