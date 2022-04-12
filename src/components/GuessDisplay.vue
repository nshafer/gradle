<script setup lang="ts">
import { ref } from 'vue';
import type { Guess } from '../guess';

defineProps<{
    guess: Guess,
}>();
</script>

<template>
    <div class="guess-display">
        <div v-for="letter in guess.letters" class="tile" :class="letter.hint">
            {{ letter.letter }}
        </div>
        <div v-if="guess.hardMode" class="hard-mode">
            *
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

    .tile {
        margin: .2em;
    }

    .hard-mode {
        /* align-self: flex-start; */
    }
</style>
