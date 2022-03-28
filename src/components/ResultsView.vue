<script setup lang="ts">
import IconAngleLeft from "./icons/IconAngleLeft.vue";

const emit = defineEmits(["backClicked"]);
</script>

<template>
    <div class="results">
        <button class="button with-icon-left" @click="$emit('backClicked')">
            <IconAngleLeft /> Back
        </button>

    </div>
</template>

<style scoped>
    .results {
        /* height: 100%; */
        background: var(--gray-4);
        padding: 1em;
    }
</style>
