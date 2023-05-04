const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
  })
  ipcMain.handle('ping', () => 'pong')
  win.loadFile(path.join(__dirname, 'index.html'))
}

ipcMain.on('fileInput', (event, files) => {
  console.log("am i here 2")
  // handle the files here
  console.log(files)
})

app.whenReady().then(createWindow)
  