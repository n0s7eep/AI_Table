import { localStg } from '@/utils/storage'
import { v4 as uuidv4 } from 'uuid';
const LOCAL_NAME = 'chatStorage'

export function defaultState(): Chat.ChatState {
  const uuid = uuidv4();
  return {
    active: uuid,
    usingContext: true,
    history: [{ uuid, title: 'New Chat', isEdit: false }],
    chat: [{ uuid, data: [] }],
  }
}

export function getLocalState(): Chat.ChatState {
  const localState = localStg.get(LOCAL_NAME)
  return { ...defaultState(), ...localState }
}

export function setLocalState(state: Chat.ChatState) {
  localStg.set(LOCAL_NAME, state)
}
