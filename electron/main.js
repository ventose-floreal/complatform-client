const { app, BrowserWindow, ipcMain, Menu, Notification, session } = require('electron');
const { fork } = require('child_process');
const path = require('path');
const { menu } = require('./main.menu');
const { events } = require('./events');

const state = {};

console.log('🚀process.env.ELECTRON_RELOADER', process.env.ELECTRON_RELOADER);

/* development reload auto */
if (process.env.ELECTRON_RELOADER) {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true
    });
  } catch (_) {
    console.log('Error', _);
  }
}

let serverProcess, mainWindow;

function showNotification(options) {
  const notification = new Notification(options);
  notification.show();
}

function createServerProcess() {
  mainWindow.webContents.send(events.NOTIFICATION, 'createServerProcess');
  /* 开发环境 */
  serverProcess = fork(require.resolve(path.resolve(__dirname, '../server/app.js')));
  serverProcess.on('close', code => {
    console.log('子线程已经退出', code);
  });
  serverProcess.on('message', async function (message) {
    const { type, PORT } = JSON.parse(message);
    if (events.CHANGE_PORT === type) {
      state.PORT = PORT;
      mainWindow.webContents.send(events.CHANGE_PORT, PORT);
      showNotification({
        title: '当前端口' + state.PORT,
        body: `API 访问http://localhost:${state.PORT}`
      });

      if (process.env.ELECTRON_RELOADER) {
        await mainWindow.loadURL('http://localhost:3010');
      } else {
        await mainWindow.loadURL(`http://localhost:${state.PORT}/ventose/index.html`);
      }
      /* cookies 失败 */
      // mainWindow.loadFile(path.resolve(__dirname, '../static/ventose/index.html'));
    }

    console.log(`Message from child.js:\n`, type, PORT);
  });
}

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    fullscreenWindowTitle: true,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, './preload.js')
    }
  });
  createServerProcess();

  ipcMain.handle('ping', () => 'pong');
  Menu.setApplicationMenu(menu(mainWindow, state));
  mainWindow.loadFile(path.resolve(__dirname, './electornDemo.html'));
  mainWindow.maximize();
  mainWindow.show();
};

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    try {
      if (serverProcess) {
        process.kill(serverProcess.pid);
      }
    } catch (error) {
      console.error(error);
    }
  }
});
