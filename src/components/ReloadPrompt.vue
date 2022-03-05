<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
    offlineReady,
    needRefresh,
    updateServiceWorker,
} = useRegisterSW()

const close = async () => {
    offlineReady.value = false
    needRefresh.value = false
}
</script>

<template>
    <div v-if="needRefresh" class="pwa-toast" role="alert">
        <div class="message">
            New version available. Click "Reload" to update.
        </div>
        <div class="buttons">
            <button class="button" @click="updateServiceWorker()">
                Reload
            </button>
            <button class="button" @click="close">
            Close
            </button>
        </div>
    </div>
</template>

<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 1em;
  padding: 1em;
  background-color: var(--color-background);
  border: 1px solid var(--gray-4);
  z-index: 1;
}
.pwa-toast .message {
  margin-bottom: .5em;
}
</style>
