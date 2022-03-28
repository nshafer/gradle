<script setup lang="ts">
import { ref } from 'vue';
import type { Guess } from '../guess';

defineProps<{
    guess: Guess,
}>();
</script>

<template>
    <div class="guess-display">
        <div v-for="hint in guess.hints" class="letter" :class="hint.state">
            {{ hint.letter }}
        </div>
    </div>
</template>

<style scoped>
    .guess-display {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        margin: -.2em;
    }

    .letter {
        padding: .5em;
        background: var(--color-absent);
        margin: .2em;
    }

    .letter.correct {
        background-color: var(--color-correct);
    }

    .letter.present {
        background-color: var(--color-present);
    }
</style>
