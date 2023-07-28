const { app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const fs = require('fs');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
  })
  win.loadFile(path.join(__dirname, 'index.html'))
}
const mainWindow = BrowserWindow.getFocusedWindow();
ipcMain.handle("showDialog", (e, message) => {
    dialog.showMessageBox(mainWindow, { message });
});

app.whenReady().then(createWindow)
  