const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  handleCounter: callback => ipcRenderer.on('update-counter', callback),
  onChangePort: callback => ipcRenderer.on('CHANGE_PORT', callback),
  onNotification: callback => ipcRenderer.on('NOTIFICATION', callback)
});
