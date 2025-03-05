import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { exec } from 'child_process'
import axios from 'axios'
import icon from '../../resources/icon.png?asset'

// 获取应用根目录
const appRoot = app.getAppPath()

// 设置conda环境名称
const CONDA_ENV_NAME = 'metagpt'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 启动 Flask 服务
  const flaskScriptPath = join(appRoot, 'multiagent', 'startup.py')
  console.log('启动Flask服务，脚本路径:', flaskScriptPath)

  // 检查文件是否存在
  const fs = require('fs')
  if (!fs.existsSync(flaskScriptPath)) {
    console.error('Flask启动脚本不存在:', flaskScriptPath)
    return
  }

  // 构建conda激活命令
  let command = ''
  if (process.platform === 'win32') {
    // Windows下使用conda.bat
    command = `conda activate ${CONDA_ENV_NAME} && python "${flaskScriptPath}"`
  } else {
    // Linux/Mac下使用conda
    command = `source activate ${CONDA_ENV_NAME} && python3 "${flaskScriptPath}"`
  }

  console.log('执行命令:', command)

  const flaskProcess = exec(
    command,
    {
      shell: '/bin/bash', // 使用bash shell
      env: {
        ...process.env,
        PYTHONPATH: join(appRoot, 'multiagent') // 设置PYTHONPATH
      }
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`启动 Flask 服务时出错: ${error.message}`)
        console.error('错误详情:', error)
        return
      }
      if (stderr) {
        console.error(`Flask 服务错误输出: ${stderr}`)
        return
      }
      console.log(`Flask 服务输出: ${stdout}`)
    }
  )

  // 监听进程错误
  flaskProcess.on('error', (err) => {
    console.error('Flask进程错误:', err)
  })

  // 监听进程退出
  flaskProcess.on('exit', (code) => {
    console.log(`Flask进程退出，退出码: ${code}`)
  })

  // 定期检查服务健康状态
  setInterval(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/health')
      console.log('服务健康状态:', response.data)
      // 发送状态到渲染进程
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('service-health', response.data)
      })
    } catch (error) {
      console.error('无法访问服务健康端点:', error)
      // 发送错误状态到渲染进程
      BrowserWindow.getAllWindows().forEach((window) => {
        window.webContents.send('service-health', { status: 'error', message: error })
      })
    }
  }, 60000) // 每60秒检查一次

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
