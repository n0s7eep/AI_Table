import axios from 'axios';

type HealthStatus = 'healthy' | 'unhealthy';

export interface HealthCheckResult {
  status: HealthStatus;
  success: boolean;
  error?: unknown;
}

/** 健康检查接口 */
export async function checkHealth(): Promise<HealthCheckResult> {
  return new Promise((resolve) => {
    window.electron.ipcRenderer.invoke('get-service-health').then((status: HealthStatus) => {
      resolve({
        status,
        success: status === 'healthy'
      });
    }).catch((error) => {
      resolve({
        status: 'unhealthy',
        success: false,
        error
      });
    });
  });
}
