<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import Button from 'primevue/button'

const authStore = useAuthStore()
</script>

<template>
  <h1>HOME</h1>
  <Button @click="authStore.logout">Signout</Button>
</template>
