import { localStg } from '@/utils/storage'
const LOCAL_NAME = 'chatStorage'

export function getLocalState(): Chat.ChatState {
  const localState = (localStg.get(LOCAL_NAME) || {}) as Partial<Chat.ChatState>
  return {
    active: localState.active ?? null,
    usingContext: localState.usingContext ?? true,
    history: localState.history ?? [],
    chat: localState.chat ?? []
  }
}

export function setLocalState(state: Chat.ChatState) {
  localStg.set(LOCAL_NAME, state)
}
