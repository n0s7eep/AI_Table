import { exec } from 'child_process'
import { join } from 'path'
import { startHealthCheck } from './health'


export const startAgentProcess = (app) => {
  // 获取应用根目录
  const appRoot = app.getAppPath()

  // 设置conda环境名称
  const CONDA_ENV_NAME = 'metagpt'

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
  let shell = ''
  if (process.platform === 'win32') {
    // Windows下使用conda.bat
    const condaPath = process.env.CONDA_HOME || process.env.USERPROFILE + '\\Anaconda3'
    command = `"${join(condaPath, 'condabin', 'conda.bat')}" activate ${CONDA_ENV_NAME} && python "${flaskScriptPath}"`
    shell = 'cmd.exe'
  } else {
    // Linux/Mac下使用conda
    command = `source activate ${CONDA_ENV_NAME} && python3 "${flaskScriptPath}"`
    shell = '/bin/bash'
  }

  console.log('执行命令:', command)

  const flaskProcess = exec(
    command,
    {
      shell: shell, // 根据平台选择合适的shell
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

  // 启动健康检查
  startHealthCheck()
}
