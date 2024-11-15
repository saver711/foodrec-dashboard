<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import Avatar from 'primevue/avatar'
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from './components/ui/sidebar/Sidebar.vue'
import { useAuthStore } from './stores/auth.store'

const visible = ref(false)

const authStore = useAuthStore()
const { user } = authStore
const userFirstLetter = user?.name.slice(0, 1)
</script>

<template>
  <main>
    <header class="flex items-center justify-between p-2">
      <i
        class="pi pi-align-left cursor-pointer"
        @click="visible = true"
        style="font-size: 2.5rem"
      ></i>
      <Sidebar v-model="visible" />

      <Avatar
        :label="userFirstLetter"
        class="mr-2"
        size="xlarge"
        shape="circle"
      />
    </header>
  </main>
  <RouterView />
  <VueQueryDevtools />
  <Toaster position="bottom-right" />
</template>
