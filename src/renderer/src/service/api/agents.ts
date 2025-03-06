export interface Agent {
  name: string;
  description: string;
  type: string;
}

/** 获取所有agent列表 */
export const getAgents = async (): Promise<Agent[]> => {
  return await window.electron.ipcRenderer.invoke('get-agents');
};

/** 获取指定类型的agent */
export const getAgentByType = async (type: string): Promise<Agent | null> => {
  return await window.electron.ipcRenderer.invoke('get-agent-by-type', type);
};
