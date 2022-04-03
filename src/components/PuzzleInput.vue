<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { Guess } from '../guess';
import GuessInput from './GuessInput.vue';

import IconTrash from './icons/IconTrash.vue';
import IconAngleRight from './icons/IconAngleRight.vue';
import GuessDisplay from './GuessDisplay.vue';

// TODO: prompt user for date or manually enter word
const answer = "snout";

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

const completed = computed(() => {
    return guesses.value.length >= 6 || guesses.value[guesses.value.length-1]?.isCorrect;
});

function letterGradeCssClass(letterGrade: string): string {
    return letterGrade.toLowerCase().replaceAll("+", " plus").replaceAll("-", " minus");
}

function wordInputDone(word: string) {
    // console.log("wordInputDone", word);
    const guessIndex = guesses.value.length;
    const previous = guessIndex > 0 ? guesses.value[guessIndex-1] : undefined;
    const guess = new Guess(word, guessIndex, answer, previous);
    guesses.value = [...guesses.value, guess];
    // guesses.value.push(new Guess(word, guessIndex, previous));
    console.log("Added guess", guess);
    // console.log("guesses", guesses.value);
}

function removeGuess(guess: Guess) {
    guesses.value = guesses.value.slice(0, guess.index);
}

function removeLastGuess() {
    guesses.value = guesses.value.slice(0, guesses.value.length-1);
}

function guessClicked(guess: Guess) {
    // console.log("PuzzleInput.guessClicked", guess)
    emit('guessClicked', guess);
}
</script>

<template>
    <div v-for="guess in guesses" :key="guess.id" class="guess" :class="{ selected: guess == selectedGuess }" @click="guessClicked(guess)" @keyup.ctrl.delete="removeLastGuess">
        <div class="title">
            <div class="word">
                <GuessDisplay :guess="guess" />
            </div>
            
            <button class="button icon" @click.stop="removeGuess(guess)" title="Remove this guess">
                <IconTrash />
            </button>
        </div>
        <div class="subtitle">
            <template v-if="guess.isCorrect">
                <div class="summary">
                    Solved in {{ guess.index+1 }} guesses
                </div>

                <button class="button icon" @click.stop="guessClicked(guess)" title="View summary">
                    <IconAngleRight />
                </button>
            </template>

            <template v-else>
                <div class="summary">
                    <div class="remaining">
                        <b>Words:</b>
                        {{ guess.previousWordsRemaining.length }} -> {{ guess.wordsRemaining.length }}
                    </div>
                    
                    <div class="bits">
                        {{ guess.bits.toFixed(1) }} / {{ guess.uncertainty.toFixed(1) }}
                        <span class="bits-label">bits of entropy</span>
                    </div>
                </div>
                
                <button class="button icon" @click.stop="guessClicked(guess)" title="View summary">
                    <IconAngleRight />
                </button>
            </template>
        </div>
        <div class="grade" :class="[letterGradeCssClass(guess.letterGrade)]">
            <div class="letter">{{ guess.letterGrade }}</div>
            <div class="percent">{{ (guess.grade*100).toFixed(0) }}%</div>
        </div>
    </div>

    <div v-if="!completed" class="guess-input">
        <GuessInput :wordIndex="guesses.length" @inputDone="wordInputDone" @goBack="removeLastGuess" />
    </div>
</template>

<style scoped>
    .guess-input p {
        margin: 0 0 1em;
    }

    .guess {
        display: grid;
        grid-template-columns: auto max-content;
        grid-template-rows: auto auto;
        grid-template-areas:
            "title grade"
            "subtitle grade";

        margin-bottom: 1em;
    }

    .guess.selected {
        outline: var(--gray-2) solid 2px;
        outline-offset: 3px;
    }
    
    .title {
        grid-area: title;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        background: var(--gray-5);
        padding-right: 0.5em;
    }

    .word {
        padding: .25em .5em;
        font-size: 1.25em;
    }

    .subtitle {
        grid-area: subtitle;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background: var(--gray-4);
        padding-right: 0.5em;
    }

    .summary {
        padding: .25em .5em;
    }

    .bits {
        font-weight: bold;
    }

    .bits-label {
        font-size: .9em;
        font-weight: normal;
        font-style: italic;
    }
    
    .grade {
        grid-area: grade;
        background: var(--gray-5);
        width: 5em;
        padding: .5em;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }

    .grade.a {
        background: var(--grade-a-bg);
        color: var(--grade-a-fg);
    }

    .grade.b {
        background: var(--grade-b-bg);
        color: var(--grade-b-fg);
    }

    .grade.c {
        background: var(--grade-c-bg);
        color: var(--grade-c-fg);
    }

    .grade.d {
        background: var(--grade-d-bg);
        color: var(--grade-d-fg);
    }

    .grade.f {
        background: var(--grade-f-bg);
        color: var(--grade-f-fg);
    }

    .letter {
        flex: 0 0 auto;
        font-size: 2.5em;
        text-shadow: 3px 2px 12px rgba(0, 0, 0, 0.7);
    }

    .percent {
        font-size: 1.1em;
        font-weight: bold;
    }

    @media screen and (min-width: 35em) {
        .word {
            font-size: 1.5em;
        }

        .summary {
            flex: 1;
            display: flex;
            flex-flow: row wrap;
            justify-content: space-between;
            align-items: center;
        }
        
        .grade {
            width: 6em;
        }
        
        .letter {
            font-size: 3em;
        }
    }

    /* Small screens only */
    @media screen and (max-width: 59.9375em) {
    }

    /* Large screens only */
    @media screen and (min-width: 60em) {
    }
</style>
