<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Agent } from '@/service/api/agents';
import { useAppStore } from '@renderer/store/modules/app';
import { useChatStore } from '@renderer/store/modules/chat';
import { $t } from '@/locales';
import { NAutoComplete, NButton, NInput, useDialog, useMessage } from 'naive-ui'

const route = useRoute();
const agent = ref<Agent | null>(null);
const messages = ref<any[]>([]);
const inputMessage = ref('');
const prompt = ref<string>('')

const loadChatRoom = async () => {
  try {
    const result = await window.electron.ipcRenderer.invoke('get-chat-room', route.query.id);
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
const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})
const handleSubmit = () => {
  // onConversation()
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
      chatStore.clearChatByUuid(route.query.id as string)
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
const sendMessage = async () => {
  if (!inputMessage.value.trim()) return;

  try {
    const result = await window.electron.ipcRenderer.invoke('send-message', route.query.id, inputMessage.value);
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
const dataSources = computed(() => chatStore.getChatByUuid(route.query.id as string))

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
        <p>聊天ID: {{ route.query.id }}</p>
        <p>Agent类型: {{ agent?.type }}</p>
      </div>
    </NCard>
    <main class="flex-1 overflow-hidden">
      <div id="scrollRef" ref="scrollRef" class="h-full overflow-hidden overflow-y-auto">
        <div
          id="image-wrapper"
          class="w-full max-w-screen-xl m-auto dark:bg-[#101014]"
          :class="[isMobile ? 'p-2' : 'p-4']"
        >
          <template v-if="!dataSources.length">
            <div class="flex items-center justify-center mt-4 text-center text-neutral-300">
              <SvgIcon icon="ri:bubble-chart-fill" class="mr-2 text-3xl" />
              <span>Aha~</span>
            </div>
          </template>
          <template v-else>
            <div>
              <!-- <Message
                v-for="(item, index) of dataSources"
                :key="index"
                :date-time="item.dateTime"
                :text="item.text"
                :inversion="item.inversion"
                :error="item.error"
                :loading="item.loading"
                @regenerate="onRegenerate(index)"
                @delete="handleDelete(index)"
              /> -->
              <div class="sticky bottom-0 left-0 flex justify-center">
                <NButton v-if="loading" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  {{ $t('common.stopResponding') }}
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
          <!-- <NAutoComplete v-model:value="prompt" :options="searchOptions" :render-label="renderOption"> -->
            <NAutoComplete v-model:value="prompt" >
            <template #default="{ handleInput, handleBlur, handleFocus }">
              <NInput
                ref="inputRef"
                v-model:value="prompt"
                type="textarea"
                :placeholder="placeholder"
                :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @keypress="handleEnter"
              />
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
