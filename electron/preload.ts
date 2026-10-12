import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('MMImage', {
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  checkUrl: (url: string) => ipcRenderer.invoke('check-url', url),
});
