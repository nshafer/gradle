<script setup lang="ts">
import Modal from './Modal.vue';
import { settings } from '../settings';

defineProps(['visible']);
defineEmits(['close']);
</script>

<template>
    <Modal v-show="visible" @close="$emit('close')" title="Help / About">
        <template #body>
            <label>
                <input type="checkbox" v-model="settings.darkMode">
                Dark Mode
            </label>
        </template>
    </Modal>
</template>
