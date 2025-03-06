import { defineStore } from 'pinia'
import { setLocalState } from './helper'
import { router } from '@/router'
import { computed, ref } from 'vue'
import { SetupStoreId } from '@renderer/enum'
import { useBoolean } from '@aitable/hooks'

export const useChatStore = defineStore(SetupStoreId.Chat, () => {
  const active = ref<string | null>(null)
  const usingContext = useBoolean(true)
  const history = ref<Chat.History[]>([])
  const chat = ref<{ uuid: string; data: Chat.Chat[] }[]>([])

  const getChatHistoryByCurrentActive = computed(() => {
    const index = history.value.findIndex(item => item.uuid === active.value)
    if (index !== -1)
      return history.value[index]
    return null
  })

  const getChatByUuid = (uuid?: string) => {
    if (uuid)
      return chat.value.find(item => item.uuid === uuid)?.data ?? []
    return chat.value.find(item => item.uuid === active.value)?.data ?? []
  }

  const setUsingContext = (context: boolean) => {
    usingContext.setBool(context)
    recordState()
  }

  const addHistory = (historyData: Chat.History, chatData: Chat.Chat[] = []) => {
    history.value.unshift(historyData)
    chat.value.unshift({ uuid: historyData.uuid, data: chatData })
    active.value = historyData.uuid
    reloadRoute(historyData.uuid)
  }

  const updateHistory = (uuid: string, edit: Partial<Chat.History>) => {
    const index = history.value.findIndex(item => item.uuid === uuid)
    if (index !== -1) {
      history.value[index] = { ...history.value[index], ...edit }
      recordState()
    }
  }

  const deleteHistory = async (index: number) => {
    history.value.splice(index, 1)
    chat.value.splice(index, 1)

    if (history.value.length === 0) {
      active.value = null
      reloadRoute()
      return
    }

    if (index > 0 && index <= history.value.length) {
      const uuid = history.value[index - 1].uuid
      active.value = uuid
      reloadRoute(uuid)
      return
    }

    if (index === 0) {
      if (history.value.length > 0) {
        const uuid = history.value[0].uuid
        active.value = uuid
        reloadRoute(uuid)
      }
    }

    if (index > history.value.length) {
      const uuid = history.value[history.value.length - 1].uuid
      active.value = uuid
      reloadRoute(uuid)
    }
  }

  const setActive = async (uuid: string) => {
    active.value = uuid
    return await reloadRoute(uuid)
  }

  const getChatByUuidAndIndex = (uuid: string, index: number) => {
    const chatIndex = chat.value.findIndex(item => item.uuid === uuid)
    if (chatIndex !== -1)
      return chat.value[chatIndex].data[index]
    return null
  }

  const addChatByUuid = (uuid: string, chatData: Chat.Chat) => {
    const index = chat.value.findIndex(item => item.uuid === uuid)
    if (index !== -1) {
      chat.value[index].data.push(chatData)
      if (history.value[index].title === 'New Chat')
        history.value[index].title = chatData.text
      recordState()
    } else {
      history.value.push({ uuid, title: chatData.text, isEdit: false })
      chat.value.push({ uuid, data: [chatData] })
      active.value = uuid
      recordState()
    }
  }

  const updateChatByUuid = (uuid: string, index: number, chatData: Chat.Chat) => {
    const chatIndex = chat.value.findIndex(item => item.uuid === uuid)
    if (chatIndex !== -1) {
      chat.value[chatIndex].data[index] = chatData
      recordState()
    }
  }

  const updateChatSomeByUuid = (uuid: string, index: number, chatData: Partial<Chat.Chat>) => {
    const chatIndex = chat.value.findIndex(item => item.uuid === uuid)
    if (chatIndex !== -1) {
      chat.value[chatIndex].data[index] = { ...chat.value[chatIndex].data[index], ...chatData }
      recordState()
    }
  }

  const deleteChatByUuid = (uuid: string, index: number) => {
    const chatIndex = chat.value.findIndex(item => item.uuid === uuid)
    if (chatIndex !== -1) {
      chat.value[chatIndex].data.splice(index, 1)
      recordState()
    }
  }

  const clearChatByUuid = (uuid: string) => {
    const index = chat.value.findIndex(item => item.uuid === uuid)
    if (index !== -1) {
      chat.value[index].data = []
      recordState()
    }
  }

  const clearHistory = () => {
    active.value = null
    usingContext.setTrue()
    history.value = []
    chat.value = []
    recordState()
  }

  const reloadRoute = async (uuid?: string) => {
    recordState()
    await router.push({ name: 'Chat', params: { uuid } })
  }

  const recordState = () => {
    setLocalState({
      active: active.value,
      usingContext: usingContext.bool.value,
      history: history.value,
      chat: chat.value
    })
  }

  return {
    active,
    usingContext,
    history,
    chat,
    getChatHistoryByCurrentActive,
    getChatByUuid,
    setUsingContext,
    addHistory,
    updateHistory,
    deleteHistory,
    setActive,
    getChatByUuidAndIndex,
    addChatByUuid,
    updateChatByUuid,
    updateChatSomeByUuid,
    deleteChatByUuid,
    clearChatByUuid,
    clearHistory,
    reloadRoute,
    recordState
  }
})
