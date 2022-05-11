<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { Guess } from '@/guess';

import GuessInput from './GuessInput.vue';
import GuessDisplay from './GuessDisplay.vue';
import AnswerPicker from './AnswerPicker.vue';
import ToolTip from './ToolTip.vue';

import IconTrash from './icons/IconTrash.vue';
import IconAngleRight from './icons/IconAngleRight.vue';
import IconCaretRight from "./icons/IconCaretRight.vue";
import IconCircleInfo from "./icons/IconCircleInfo.vue";
import { letterGrade, letterGradeSimple } from '@/game';

const answer = ref("");

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

function wordInputDone(word: string) {
    // console.log("wordInputDone", word);
    const guessIndex = guesses.value.length;
    const previous = guessIndex > 0 ? guesses.value[guessIndex-1] : undefined;
    const guess = new Guess(word, guessIndex, answer.value, previous);
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

// Remove all guesses if the answer changes
watch(answer, (newAnswer, oldAnswer) => {
    if (newAnswer !== oldAnswer) {
        guesses.value = [];
    }
});

function guessClicked(guess: Guess) {
    // console.log("PuzzleInput.guessClicked", guess)
    emit('guessClicked', guess);
}

const allGrades = computed(() => {
    const grades: number[] = [];

    for (let guess of guesses.value) {
        grades.push(guess.grade);
    }

    const unusedGuesses = 6 - guesses.value.length;
    for (let i = 0; i < unusedGuesses; i++) {
        grades.push(1);
    }

    return grades;
});

const finalGrade = computed(() => {
    // Average of all guess grades
    let sum = 0;
    
    for (let guess of guesses.value) {
        sum += guess.grade;
    }

    // Add 100 per unused guess
    sum += (6 - guesses.value.length) * 1;
    
    return sum/6;
});

const finalLetterGrade = computed(() => {
    return letterGrade(finalGrade.value);
});

const finalLetterGradeSimple = computed(() => {
    return letterGradeSimple(finalGrade.value);
});

</script>

<template>
    <AnswerPicker @answerUpdated="newAnswer => answer = newAnswer" />

    <!-- {{ ansewr }}-->

    <template v-if="answer">
        <div v-for="guess in guesses" :key="guess.id" class="guess" :class="{ selected: guess == selectedGuess, 'is-correct': guess.isCorrect }, [guess.letterGradeSimple]" @click="guessClicked(guess)" @keyup.ctrl.delete="removeLastGuess">
            <div class="title">
                <div class="title-heading">
                    <GuessDisplay :guess="guess" />
                </div>
                
                <button class="button icon" @click.stop="removeGuess(guess)" title="Remove this guess">
                    <IconTrash />
                </button>
            </div>
            <div class="subtitle">
                <div class="summary">
                    <div v-if="guess.isCorrect" class="remaining">
                        <b>Solved in {{ guesses.length }} guesses.</b>
                    </div>
                    <div v-else class="remaining">
                        <b>Words:</b>
                        {{ guess.previousWordsRemaining.length }}
                        <div class="icon-inline"><IconCaretRight /></div>
                        {{ guess.wordsRemaining.length }}
                    </div>
                </div>
                
                <div class="bits">
                    {{ guess.bits.toFixed(1) }} / {{ guess.uncertainty.toFixed(1) }}
                    <span class="bits-label">bits</span>
                </div>
                
                <button class="button icon" @click.stop="guessClicked(guess)" title="View summary">
                    <IconAngleRight />
                </button>
            </div>
            <div class="grade grade-color" :class="[guess.letterGradeSimple]">
                <div class="letter">{{ guess.letterGrade }}</div>
                <div class="label">{{ (guess.grade*100).toFixed(0) }}%</div>
            </div>
        </div>

        <div v-if="completed" class="final-grade">
            <div class="final-grade__main">
                <div class="final-grade__body">
                    <div class="final-grade__title">
                        <div class="final-grade__heading">
                            Final Grade
                        </div>
                        <ToolTip>
                            <button class="button icon"><IconCircleInfo /></button>
                            <template #content>
                                A final grade is calculated by averaging the grade of each guess;
                                extra guesses are worth 100% each.

                                <p>
                                    <small>g<sub>f</sub></small> =
                                    avg(<template v-for="(grade, i) in allGrades">{{ grade.toFixed(2) }}<template v-if="i < allGrades.length-1">, </template></template>)
                                </p>
                            </template>
                        </ToolTip>
                    </div>

                    <div class="final-grade__subtitle">
                        <div class="final-grade__subtitle">
                            <div class="final-grade__guesses">
                                {{ guesses.length }} / 6 Guesses.
                            </div>
                            <div v-if="guesses[guesses.length-1].hardMode">
                                Hard mode.
                            </div>
                        </div>
                    </div>
                </div>

                <button class="share-button button primary">
                    Share
                </button>
            </div>
            
            <div class="grade grade-color" :class="[finalLetterGradeSimple]">
                <div class="letter">{{ finalLetterGrade }}</div>
                <div class="label">{{ (finalGrade*100).toFixed(0) }}%</div>
            </div>
        </div>

        <div v-else class="guess-input">
            <GuessInput :wordIndex="guesses.length" @inputDone="wordInputDone" @goBack="removeLastGuess" />
        </div>
    </template>
</template>

<style scoped>
    .answer-picker {
        margin-bottom: 1em;
    }

    .guess-input {
        padding: 0 1em;
    }

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
        justify-content: space-between;
        align-items: center;
        background: var(--page-bg2);
        padding-right: 0.5em;
    }

    .title-heading {
        padding: .25em .5em;
        font-size: 1.25em;
    }

    .subtitle {
        grid-area: subtitle;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background: var(--page-bg);
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
    }

    .final-grade {
        display: flex;
        flex-flow: row nowrap;

        padding-top: 1em;
        margin: 1em 0;
        border-top: 1px solid var(--gray-4);
    }

    .final-grade__main {
        flex: 1;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background: var(--page-bg2);
        padding: 1em;
    }

    .final-grade__title {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .final-grade__subtitle {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
    }

    .final-grade__heading {
        font-size: 1.5em;
    }

    .final-grade__guesses {
        margin-right: .5em;
    }

    .share-button {
        margin-left: auto;
        background-color: var(--button-green);
    }

    @media screen and (min-width: 35em) {
        .title-heading {
            font-size: 1.5em;
        }

        .summary {
            flex: 1;
            display: flex;
            flex-flow: row wrap;
            align-items: center;
        }
        
        .grade {
            font-size: 1.2em;
        }

        .final-grade__heading {
            font-size: 2em;
        }
    }

    /* Small screens only */
    @media screen and (max-width: 69.9375em) {
    }

    /* Large screens only */
    @media screen and (min-width: 70em) {
    }
</style>
