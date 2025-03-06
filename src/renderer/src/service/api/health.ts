import axios from 'axios';

type HealthStatus = 'healthy' | 'unhealthy';

export interface HealthCheckResult {
  status: HealthStatus;
  success: boolean;
  error?: unknown;
}

/** 健康检查接口 */
export async function checkHealth(): Promise<HealthCheckResult> {
  try {
    const response = await axios.get('http://localhost:5000/api/health', {
      timeout: 5000 // 5秒超时
    });
    return {
      status: response.status === 200 ? 'healthy' : 'unhealthy',
      success: response.status === 200
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      success: false,
      error
    };
  }
}
