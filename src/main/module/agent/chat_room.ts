import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface ChatRoom {
  id: string;
  agentType: string;
  agent: any;
  messages: any[];
}

class ChatRoomManager {
  private rooms: Map<string, ChatRoom> = new Map();

  createRoom(agentType: string): string {
    const roomId = uuidv4();
    const room: ChatRoom = {
      id: roomId,
      agentType,
      agent: null,
      messages: []
    };
    this.rooms.set(roomId, room);
    return roomId;
  }

  async getRoom(roomId: string): Promise<ChatRoom | null> {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    // 如果还没有获取到 agent 信息，则从 multiagent 服务获取
    if (!room.agent) {
      try {
        const response = await axios.get(`http://localhost:5000/api/agents/${room.agentType}`);
        room.agent = response.data;
      } catch (error) {
        console.error('获取agent信息失败:', error);
        return null;
      }
    }

    return room;
  }

  async sendMessage(roomId: string, message: string): Promise<any> {
    const room = await this.getRoom(roomId);
    if (!room) return null;

    try {
      // 这里后续需要实现与 multiagent 的通信
      // 暂时返回模拟数据
      return {
        role: 'assistant',
        content: `这是来自 ${room.agent.name} 的回复`
      };
    } catch (error) {
      console.error('发送消息失败:', error);
      return null;
    }
  }

  deleteRoom(roomId: string): boolean {
    return this.rooms.delete(roomId);
  }
}

export const chatRoomManager = new ChatRoomManager();
