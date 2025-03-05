<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NConfigProvider, darkTheme } from 'naive-ui'
import type { WatermarkProps } from 'naive-ui'
import { useAppStore } from './store/modules/app'
import { useThemeStore } from './store/modules/theme'
import { naiveDateLocales, naiveLocales } from './locales/naive'

defineOptions({
  name: 'App'
})

const appStore = useAppStore()
const themeStore = useThemeStore()

const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : undefined))

const naiveLocale = computed(() => {
  return naiveLocales[appStore.locale]
})

const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.locale]
})

const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: themeStore.watermark.text,
    cross: true,
    fullscreen: true,
    fontSize: 16,
    lineHeight: 16,
    width: 384,
    height: 384,
    xOffset: 12,
    yOffset: 60,
    rotate: -15,
    zIndex: 9999
  }
})

const serviceStatus = ref('未知')
const serviceMessage = ref('')

onMounted(() => {
  // 监听服务健康状态更新
  window.api.serviceHealth.onHealthUpdate((data) => {
    if (data.status === 'error') {
      serviceStatus.value = '错误'
      serviceMessage.value = data.message
    } else {
      serviceStatus.value = data.status
      serviceMessage.value = data.message
    }
  })
})
</script>

<template>
  <div class="service-status">
    <p>服务状态: {{ serviceStatus }}</p>
    <p>服务信息: {{ serviceMessage }}</p>
  </div>
  <NConfigProvider
    :theme="naiveDarkTheme"
    :theme-overrides="themeStore.naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    class="h-full"
  >
    <AppProvider>
      <RouterView class="bg-layout" />
      <NWatermark v-if="themeStore.watermark.visible" v-bind="watermarkProps" />
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped>
.service-status {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
}
</style>
