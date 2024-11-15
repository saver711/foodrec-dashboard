<script setup lang="ts">
import Drawer from 'primevue/drawer'
import PanelMenu from 'primevue/panelmenu'
import { sidebarItems } from './consts/sidebar-items'

// ////////
const visible = defineModel({
  required: true,
  type: Boolean,
})
</script>

<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible" header="Drawer">
      <PanelMenu :model="sidebarItems" class="w-full border-0" />
    </Drawer>
  </div>
</template>
