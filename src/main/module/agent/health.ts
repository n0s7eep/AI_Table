import { clearInterval, setInterval } from 'timers'
import axios from 'axios'
import { BrowserWindow, ipcMain } from 'electron'

// 健康检查间隔时间（毫秒）
const HEALTH_CHECK_INTERVAL = {
  UNHEALTHY: 50,    // 不健康时每50ms检查
  HEALTHY: 60000    // 健康时每60s检查
}

// 健康检查相关变量
let healthCheckTimer: NodeJS.Timeout | null = null
let isHealthy = false

// 通知渲染进程服务状态
const notifyServiceStatus = (status: 'healthy' | 'unhealthy') => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send('service-status-change', status)
  })
}

// 健康检查函数
const checkHealth = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/health', {
      timeout: 5000 // 5秒超时
    })
    const isServiceHealthy = response.status === 200

    // 如果健康状态发生变化，调整检查间隔
    if (isServiceHealthy !== isHealthy) {
      isHealthy = isServiceHealthy
      if (healthCheckTimer) {
        clearInterval(healthCheckTimer)
      }

      const interval = isHealthy ? HEALTH_CHECK_INTERVAL.HEALTHY : HEALTH_CHECK_INTERVAL.UNHEALTHY
      healthCheckTimer = setInterval(checkHealth, interval)

      console.log(`服务健康状态: ${isHealthy ? '健康' : '不健康'}, 检查间隔: ${interval}ms`)
      notifyServiceStatus(isHealthy ? 'healthy' : 'unhealthy')
    }
  } catch (error) {
    // 如果请求失败，认为服务不健康
    if (isHealthy) {
      isHealthy = false
      if (healthCheckTimer) {
        clearInterval(healthCheckTimer)
      }
      healthCheckTimer = setInterval(checkHealth, HEALTH_CHECK_INTERVAL.UNHEALTHY)
      console.log('服务不健康，切换到快速检查模式:', error)
      notifyServiceStatus('unhealthy')
    }
  }
}

export const startHealthCheck = () => {
  // 启动健康检查
  checkHealth()

  // 注册IPC处理程序
  ipcMain.handle('get-service-health', () => {
    return isHealthy ? 'healthy' : 'unhealthy'
  })
}

export const stopHealthCheck = () => {
  if (healthCheckTimer) {
    clearInterval(healthCheckTimer)
    healthCheckTimer = null
  }
}
