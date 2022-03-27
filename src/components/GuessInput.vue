<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { cleanLetters } from '../util';

const props = defineProps<{
    wordIndex: number
}>();

const emit = defineEmits<{
    (e: 'inputDone', word: string): void
}>();

const input = ref<HTMLInputElement | null>(null);
const word = ref("");

onMounted(() => {
    input.value?.focus();
})

const wordNumber = computed(() => {
    switch (props.wordIndex) {
        case 0:
            return "First";
        case 1:
            return "Second";
        case 2:
            return "Third";
        case 3:
            return "Fourth";
        case 4:
            return "Fifth";
        case 5:
            return "Sixth";
        default:
            return `${props.wordIndex}nth`;
    }
})

function finishInput() {
    emit("inputDone", word.value.toLowerCase());
    word.value = "";
}

function updateWord(event: Event) {
    // We use this instead of v-model so we can fire on every input, which doesn't happen with
    // an IME that does composition, such as Chrome mobile.
    if (event.target && event.target instanceof HTMLInputElement) {
        var cleaned = cleanLetters(event.target.value)
        word.value = event.target.value = cleaned;
    }
    if (word.value.length >= 5) {
        finishInput();
    }
}
</script>

<template>
    <div class="wrapper">
        <input :value="word" @input="updateWord" ref="input" :placeholder="`${wordNumber} guess`"
            class="input" type="text" maxlength="5" inputmode="text" enterkeyhint="done"/>
    </div>
</template>

<style scoped>
    .wrapper {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
    }

    .input {
        background: var(--input-bg);
        width: 100%;
        max-width: 12em;
        height: 1.5em;
        font-size: 1.3em;
        color: var(--input-text-color);
        /* text-transform: uppercase; */
        font-weight: bold;
        text-align: center;
        border: none;
        letter-spacing: .1em;
    }

    .input::placeholder {
        letter-spacing: normal;
        text-transform: none;
        color: var(--input-placeholder-color);
        font-size: 1rem;
        font-weight: normal;
    }
</style>
