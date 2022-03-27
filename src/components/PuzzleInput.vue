<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Guess } from '../guess';
import GuessInput from './GuessInput.vue';

import IconTrash from './icons/IconTrash.vue';
import IconAngleRight from './icons/IconAngleRight.vue';

// TODO: ask user for date or manually enter word
const answer = "epoxy";

const props = defineProps<{
    modelValue: Guess[],
    selectedGuess?: Guess,
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', guesses: Guess[]): void
    (e: 'guessClicked', guess: Guess): void
}>();

const guesses = computed<Guess[]>({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    }
});

function wordInputDone(word: string) {
    console.log("wordInputDone", word);
    const guessIndex = guesses.value.length;
    const previous = guessIndex > 0 ? guesses.value[guessIndex-1] : undefined;
    guesses.value = [...guesses.value, new Guess(word, guessIndex, answer, previous)];
    // guesses.value.push(new Guess(word, guessIndex, previous));
}

function removeGuess(guess: Guess) {
    guesses.value = guesses.value.slice(0, guess.index);
}

function guessClicked(guess: Guess) {
    console.log("PuzzleInput.guessClicked", guess)
    emit('guessClicked', guess);
}
</script>

<template>
    <div v-for="guess in guesses" :key="guess.id" class="guess" :class="{ selected: guess == selectedGuess }" @click="guessClicked(guess)">
        <div class="title">
            <!-- replace with component that renders the word with characters colored -->
            <div class="word">
                {{ guess.word }}
            </div>
            
            <button class="button icon" @click="removeGuess(guess)">
                <IconTrash />
            </button>
        </div>
        <div class="subtitle">
            <div class="grade">
                {{ guess.index }}: ({{ guess.id }})  (previous: {{ guess.previous?.word }})
            </div>
            
            <button class="button icon" @click="guessClicked(guess)">
                <IconAngleRight />
            </button>
        </div>
    </div>

    <GuessInput v-if="guesses.length < 6" :wordIndex="guesses.length" @inputDone="wordInputDone" />
</template>

<style scoped>
    .guess {
        border: 1px solid transparent;
        margin-bottom: 1em;
    }

    .guess.selected {
        /* outline: var(--gray-3) solid 2px;
        outline-offset: 3px; */
        border-color: var(--gray-2);
    }

    .title {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background: var(--gray-5);
    }
    
    .word {
        font-size: 1.2em;
        text-transform: uppercase;
        padding: .5em;
    }

    .subtitle {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background: var(--gray-4);
    }

    .grade {
        padding: .5em;
    }

</style>
