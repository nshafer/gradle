<script setup lang="ts">
import type { Guess } from "@/guess";
import IconAngleLeft from "./icons/IconAngleLeft.vue";
import GuessDisplay from "./GuessDisplay.vue";

defineProps<{
    guess: Guess | undefined
}>();

defineEmits(["backClicked"]);

</script>

<template>
    <div class="summary">
        <button class="button with-icon-left" @click="$emit('backClicked')">
            <IconAngleLeft /> Back
        </button>

        <div v-if="guess" class="guess">
            <GuessDisplay :guess="guess" />
        </div>
    </div>
</template>

<style scoped>
    .summary {
        /* height: 100%; */
        background: var(--gray-5);
        padding: 1em;
    }
</style>
