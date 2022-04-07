<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { cleanLetters } from '@/util';
import { allWords } from '@/words';

const props = defineProps<{
    wordIndex: number
}>();

const emit = defineEmits<{
    (e: 'inputDone', word: string): void,
    (e: 'goBack'): void,
}>();

const input = ref<HTMLInputElement | null>(null);
const word = ref("");
const inputError = ref(false);

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
    inputError.value = false;
    // We use this instead of v-model so we can fire on every input, which doesn't happen with
    // an IME that does composition, such as Chrome mobile.
    if (event.target && event.target instanceof HTMLInputElement) {
        var cleaned = cleanLetters(event.target.value).slice(0, 5);
        word.value = event.target.value = cleaned;
    }
    // if (word.value.length >= 5) {
    //     finishInput();
    // }
}

function checkWord() {
    if (word.value.length == 5 && allWords.includes(word.value)) {
        finishInput();
    } else {
        inputError.value = true;
    }
}

</script>

<template>
    <form @submit.prevent="checkWord">
        <input :value="word" ref="input"
            @input="updateWord"
            @keyup.ctrl.delete="$emit('goBack')"
            :placeholder="`${wordNumber} guess`"
            class="input" :class="{ error: inputError }"
            type="text" maxlength="5" inputmode="text" enterkeyhint="done"/>
    </form>
</template>

<style scoped>
    .input {
        font-size: 1.5em;
        text-transform: uppercase;
        font-weight: bold;
        line-height: 1;
        padding: .5em;
    }
</style>
