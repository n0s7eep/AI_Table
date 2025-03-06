export interface Agent {
  name: string;
  description: string;
  type: string;
}

/** 获取所有agent列表 */
export async function getAgents(): Promise<Agent[]> {
  return window.electron.ipcRenderer.invoke('get-agents');
}
