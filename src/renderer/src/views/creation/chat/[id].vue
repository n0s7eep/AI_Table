<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Agent } from '@/service/api/agents';
import { useAppStore } from '@renderer/store/modules/app';
import { useChatStore } from '@renderer/store/modules/chat';
import { $t } from '@/locales';
import { NAutoComplete, NButton, NInput, useDialog, useMessage } from 'naive-ui'
import { useChat } from '@renderer/hooks/business/chat';
import { useScroll } from '@renderer/hooks/common/scroll';
import { useUsingContext } from '@renderer/hooks/business/usingContext';
import { fetchChatAPIProcess } from '@renderer/service/api/chat';
import Message from '@/components/Message/index.vue';
import HoverButton from '@/components/common/hover-button.vue';

const route = useRoute();
const { id: uuid } = route.params as { id: string }
const agent = ref<Agent | null>(null);
const messages = ref<any[]>([]);
const inputMessage = ref('');
const prompt = ref<string>('')
const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true'
let controller = new AbortController()

const loadChatRoom = async () => {
  try {
    const result = await window.electron.ipcRenderer.invoke('get-chat-room', uuid);
    if (result.success) {
      agent.value = result.room.agent;
      messages.value = result.room.messages;
    } else {
      console.error('获取聊天室信息失败:', result.error);
    }
  } catch (error) {
    console.error('获取聊天室信息失败:', error);
  }
};
const appStore = useAppStore();
const chatStore = useChatStore();
const { usingContext, toggleUsingContext } = useUsingContext()
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !!item.conversationOptions)))

// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
// const { promptList: promptTemplate } = storeToRefs<any>(promptStore)
const promptTemplate = ref<any[]>([]);

const dialog = useDialog()
const loading = ref<boolean>(false)
const isMobile = computed(() => appStore.isMobile);
const placeholder = computed(() => {
  if (isMobile.value)
    return $t('chat.placeholderMobile')
  return $t('chat.placeholder')
})


const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === ''
})

// 可优化部分
// 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
// 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
const searchOptions = computed(() => {
  if (prompt.value.startsWith('/')) {
    return promptTemplate.value.filter((item: { key: string }) => item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  }
  else {
    return []
  }
})
// value反渲染key
const renderOption = (option: { label: string }) => {
  for (const i of promptTemplate.value) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}
const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})
const handleSubmit = () => {
  onConversation()
}
const handleClear = () => {
  if (loading.value)
    return

  dialog.warning({
    title: $t('chat.clearChat'),
    content: $t('chat.clearChatConfirm'),
    positiveText: $t('common.yesOrNo.yes'),
    negativeText: $t('common.yesOrNo.no'),
    onPositiveClick: () => {
      chatStore.clearChatByUuid(uuid)
    },
  })
}

const handleEnter = (event: KeyboardEvent) => {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
  else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

const handleStop = () => {
  if (loading.value) {
    // controller.abort()
    loading.value = false
  }
}


const handleDelete = (index: number) => {
  if (loading.value)
    return

  dialog.warning({
    title: $t('chat.deleteMessage'),
    content: $t('chat.deleteMessageConfirm'),
    positiveText: $t('common.yesOrNo.yes'),
    negativeText: $t('common.yesOrNo.no'),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(uuid, index)
    },
  })
}

const onConversation = async () => {
  let message = prompt.value

  if (loading.value)
    return

  if (!message || message.trim() === '')
    return

  // controller = new AbortController()

  addChat(
    uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: message,
      inversion: true,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: null },
    },
  )
  scrollToBottom()

  loading.value = true
  prompt.value = ''

  let options: Chat.ConversationRequest = {}
  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions

  if (lastContext && usingContext.value)
    options = { ...lastContext }

  addChat(
    uuid,
    {
      dateTime: new Date().toLocaleString(),
      text: '思考中',
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )
  scrollToBottom()

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        prompt: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            const data = JSON.parse(chunk)
            updateChat(
              uuid,
              dataSources.value.length - 1,
              {
                dateTime: new Date().toLocaleString(),
                text: lastText + (data.text ?? ''),
                inversion: false,
                error: false,
                loading: true,
                conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                requestOptions: { prompt: message, options: { ...options } },
              },
            )

            if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }

            scrollToBottomIfAtBottom()
          }
          catch (error) {
            //
          }
        },
      })
      updateChatSome(uuid, dataSources.value.length - 1, { loading: false })
    }

    await fetchChatAPIOnce()
  }
  catch (error: any) {
    const errorMessage = error?.message ?? $t('common.wrong')

    if (error.message === 'canceled') {
      updateChatSome(
        uuid,
        dataSources.value.length - 1,
        {
          loading: false,
        },
      )
      scrollToBottomIfAtBottom()
      return
    }

    const currentChat = getChatByUuidAndIndex(uuid, dataSources.value.length - 1)

    if (currentChat?.text && currentChat.text !== '') {
      updateChatSome(
        uuid,
        dataSources.value.length - 1,
        {
          text: `${currentChat.text}\n[${errorMessage}]`,
          error: false,
          loading: false,
        },
      )
      return
    }

    updateChat(
      uuid,
      dataSources.value.length - 1,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
    scrollToBottomIfAtBottom()
  }
  finally {
    loading.value = false
  }
}


const onRegenerate = async (index: number) => {
  if (loading.value)
    return

  controller = new AbortController()

  const { requestOptions } = dataSources.value[index]

  let message = requestOptions?.prompt ?? ''

  let options: Chat.ConversationRequest = {}

  if (requestOptions.options)
    options = { ...requestOptions.options }

  loading.value = true

  updateChat(
    uuid,
    index,
    {
      dateTime: new Date().toLocaleString(),
      text: '',
      inversion: false,
      error: false,
      loading: true,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    },
  )

  try {
    let lastText = ''
    const fetchChatAPIOnce = async () => {
      await fetchChatAPIProcess<Chat.ConversationResponse>({
        prompt: message,
        options,
        signal: controller.signal,
        onDownloadProgress: ({ event }) => {
          const xhr = event.target
          const { responseText } = xhr
          // Always process the final line
          const lastIndex = responseText.lastIndexOf('\n', responseText.length - 2)
          let chunk = responseText
          if (lastIndex !== -1)
            chunk = responseText.substring(lastIndex)
          try {
            const data = JSON.parse(chunk)
            updateChat(
              uuid,
              index,
              {
                dateTime: new Date().toLocaleString(),
                text: lastText + (data.text ?? ''),
                inversion: false,
                error: false,
                loading: true,
                conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
                requestOptions: { prompt: message, options: { ...options } },
              },
            )

            if (openLongReply && data.detail.choices[0].finish_reason === 'length') {
              options.parentMessageId = data.id
              lastText = data.text
              message = ''
              return fetchChatAPIOnce()
            }
          }
          catch (error) {
            //
          }
        },
      })
      updateChatSome(uuid, index, { loading: false })
    }
    await fetchChatAPIOnce()
  }
  catch (error: any) {
    if (error.message === 'canceled') {
      updateChatSome(
        uuid,
        index,
        {
          loading: false,
        },
      )
      return
    }

    const errorMessage = error?.message ?? $t('common.wrong')

    updateChat(
      uuid,
      index,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: message, options: { ...options } },
      },
    )
  }
  finally {
    loading.value = false
  }
}


const sendMessage = async () => {
  if (!inputMessage.value.trim()) return;

  try {
    const result = await window.electron.ipcRenderer.invoke('send-message', uuid, inputMessage.value);
    if (result.success) {
      messages.value.push({
        role: 'user',
        content: inputMessage.value
      });
      messages.value.push(result.response);
      inputMessage.value = '';
    } else {
      console.error('发送消息失败:', result.error);
    }
  } catch (error) {
    console.error('发送消息失败:', error);
  }
};
const dataSources = computed(() => chatStore.getChatByUuid(uuid))

onMounted(() => {
  loadChatRoom();
});
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <NCard :bordered="false" class="chat-card">
      <template #header>
        <div class="chat-header">
          <h2>{{ agent?.name || '未知Agent' }}</h2>
          <p class="description">{{ agent?.description || '暂无描述' }}</p>
        </div>
      </template>
      <div class="chat-content">
        <!-- 这里后续可以添加聊天界面 -->
        <p>聊天ID: {{ uuid }}</p>
        <p>Agent类型: {{ agent?.type }}</p>
      </div>
    </NCard>
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div id="image-wrapper" class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
          :class="[isMobile ? 'p-2' : 'p-4']">
          <template v-if="!dataSources.length">
            <div class="flex items-center justify-center mt-4 text-center text-neutral-300">
              <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
              <span>Aha~</span>
            </div>
          </template>
          <template v-else>
            <div>
              <Message v-for="(item, index) of dataSources" :key="index" :date-time="item.dateTime" :text="item.text"
                :inversion="item.inversion" :error="item.error" :loading="item.loading"
                @regenerate="onRegenerate(index)" @delete="handleDelete(index)" />
              <div class="sticky bottom-0 left-0 flex justify-center">
                <NButton v-if="loading" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  {{ $t('chat.stopResponding') }}
                </NButton>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <HoverButton v-if="!isMobile" @click="handleClear">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:delete-bin-line" />
            </span>
          </HoverButton>
          <!-- <HoverButton v-if="!isMobile" @click="handleExport">
            <span class="text-xl text-[#4f555e] dark:text-white">
              <SvgIcon icon="ri:download-2-line" />
            </span>
          </HoverButton> -->
          <!-- <HoverButton @click="toggleUsingContext">
            <span class="text-xl" :class="{ 'text-[#4b9e5f]': usingContext, 'text-[#a8071a]': !usingContext }">
              <SvgIcon icon="ri:chat-history-line" />
            </span>
          </HoverButton> -->
          <NAutoComplete v-model:value="prompt" :options="searchOptions" :render-label="renderOption">
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput ref="inputRef" v-model:value="prompt" type="textarea" :placeholder="placeholder"
                :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }" @input="handleInput" @focus="handleFocus"
                @blur="handleBlur" @keypress="handleEnter" />
            </template>
          </NAutoComplete>
          <NButton type="primary" :disabled="buttonDisabled" @click="handleSubmit">
            <template #icon>
              <span class="dark:text-black">
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
          </NButton>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.chat-card {
  /* height: 30%; */
}

.chat-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.description {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.chat-content {
  overflow-y: auto;
}
</style>
