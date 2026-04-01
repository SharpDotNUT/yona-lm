import { MyPreset } from './perset';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  modules: ['@primevue/nuxt-module', '@varlet/nuxt'],
  primevue: {
    options: {
      theme: {
        preset: MyPreset
      }
    }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  css: ['./app/assets/css/main.css'],
  devtools: { enabled: true }
});
