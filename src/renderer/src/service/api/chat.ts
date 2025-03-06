import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  // const settingStore = useSettingStore()
  // const authStore = useAuthStore()

  // let data: Record<string, any> = {
  //   prompt: params.prompt,
  //   options: params.options,
  // }

  // if (authStore.isChatGPTAPI) {
  //   data = {
  //     ...data,
  //     systemMessage: settingStore.systemMessage,
  //     temperature: settingStore.temperature,
  //     top_p: settingStore.top_p,
  //   }
  // }

  return {};
  // return post<T>({
  //   url: '/chat-process',
  //   data,
  //   signal: params.signal,
  //   onDownloadProgress: params.onDownloadProgress,
  // })
}
