import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import { resolve } from 'path';
import { defineConfig as defineViteConfig } from 'vite'
import { setupVitePlugins } from './build/plugins';
import {  getBuildTime } from './build/config';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: defineViteConfig(configEnv => {
    const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

    const buildTime = getBuildTime();

    return {
      base: viteEnv.VITE_BASE_URL,
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@': resolve('src/renderer/src')
        }
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
            additionalData: `@use "@/styles/scss/global.scss" as *;`
          }
        }
      },
      plugins: setupVitePlugins(viteEnv, buildTime),
      define: {
        BUILD_TIME: JSON.stringify(buildTime)
      },
      server: {
        host: '0.0.0.0',
        port: 9527,
      },
      preview: {
        port: 9725
      },
      build: {
        reportCompressedSize: false,
        sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
        commonjsOptions: {
          ignoreTryCatch: false
        }
      }
    };
  })
})
