const { Menu } = require('electron');

exports.menu = (mainWindow, state) => {
  return Menu.buildFromTemplate([
    {
      label: '通用',
      submenu: [
        {
          label: '当前端口',
          click: () => {
            showNotification({
              title: '当前端口' + state.PORT,
              body: `API 访问http://localhost:${state.PORT}`
            });
          }
        }
      ]
    },
    {
      label: '开发者工具',
      click: () => {
        mainWindow.webContents.openDevTools();
      }
    }
  ]);
};
