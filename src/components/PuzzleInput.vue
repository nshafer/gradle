<script setup lang="ts">
import { ref, watch, computed, onUpdated, nextTick } from 'vue';
import { Guess } from '@/guess';
import { dateIndex, letterGrade, letterGradeSimple } from '@/game';

import GuessInput from './GuessInput.vue';
import GuessDisplay from './GuessDisplay.vue';
import ToolTip from './ToolTip.vue';
import ShareModal from './ShareModal.vue';

import IconTrash from './icons/IconTrash.vue';
import IconAngleRight from './icons/IconAngleRight.vue';
import IconCaretRight from "./icons/IconCaretRight.vue";
import IconCircleInfo from "./icons/IconCircleInfo.vue";
import IconShare from "./icons/IconShare.vue";

const props = defineProps<{
    guesses: Guess[]
    selectedGuess?: Guess
    puzzleAnswer: string,
    puzzleDate?: Date,
    shareCode: string,
    shareURL: string,
}>();

const emit = defineEmits<{
    (e: 'appendGuess', guess: Guess): void
    (e: 'removeGuess', index: number): void
    (e: 'guessClicked', guess: Guess): void
}>();

const showShareModal = ref(false);

function appendGuess(word: string) {
    const guessIndex = props.guesses.length;
    const previous = guessIndex > 0 ? props.guesses[guessIndex - 1] : undefined;
    const guess = new Guess(word, guessIndex, props.puzzleAnswer, previous);
    emit("appendGuess", guess);
}

function inputDone(word: string) {
    appendGuess(word);
}

function removeGuess(guess: Guess) {
    emit('removeGuess', guess.index);
}

function removeLastGuess() {
    emit('removeGuess', props.guesses.length - 1);
}


function guessClicked(guess: Guess) {
    // console.log("PuzzleInput.guessClicked", guess)
    emit('guessClicked', guess);
}

//
// Some helpful computed values
//

const lastGuess = computed(() => {
    if (props.guesses.length > 0) {
        return props.guesses[props.guesses.length - 1];
    } else {
        return undefined;
    }
});

const completed = computed(() => {
    return lastGuess.value != undefined && lastGuess.value.isComplete;
});

const busted = computed(() => {
    return lastGuess.value != undefined && lastGuess.value.isBusted;
});

const hardMode = computed(() => {
    return lastGuess.value != undefined && lastGuess.value.hardMode;
});

const allGrades = computed(() => {
    const grades: number[] = [];

    for (let guess of props.guesses) {
        grades.push(guess.grade);
    }

    const unusedGuesses = 6 - props.guesses.length;
    for (let i = 0; i < unusedGuesses; i++) {
        grades.push(1);
    }

    return grades;
});

const finalGrade = computed(() => {
    // Average of all guess grades
    let sum = 0;
    
    for (let guess of props.guesses) {
        sum += guess.grade;
    }

    // Add 100 per unused guess
    sum += (6 - props.guesses.length) * 1;
    
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
    <div v-for="guess in guesses" :key="guess.id" class="guess"
        :class="{ selected: guess == selectedGuess, 'is-correct': guess.isCorrect }, [guess.letterGradeSimple]"
        @click="guessClicked(guess)" @keyup.ctrl.delete="removeLastGuess">
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
                    <div class="icon-inline">
                        <IconCaretRight />
                    </div>
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
                        <button class="button icon">
                            <IconCircleInfo />
                        </button>
                        <template #content>
                            A final grade is calculated by averaging the grade of each guess;
                            extra unused guesses are worth 100% each.

                            <p>
                                <small>g<sub>f</sub></small> =
                                avg(<template v-for="(grade, i) in allGrades">{{ grade.toFixed(2) }}<template
                                        v-if="i < allGrades.length-1">, </template></template>)
                            </p>
                        </template>
                    </ToolTip>
                </div>

                <div class="final-grade__subtitle">
                    <div class="final-grade__subtitle">
                        <div class="final-grade__guesses">
                            <template v-if="busted">
                                X / 6 Guesses.
                            </template>
                            <template v-else>
                                {{ guesses.length }} / 6 Guesses.
                            </template>
                        </div>
                        <div v-if="hardMode">
                            Hard mode.
                        </div>
                    </div>
                </div>
            </div>

            <button class="share-button button primary with-icon-left" @click="showShareModal = true">
                <IconShare />
                Share
            </button>
        </div>

        <div class="grade grade-color" :class="[finalLetterGradeSimple]">
            <div class="letter">{{ finalLetterGrade }}</div>
            <div class="label">{{ (finalGrade*100).toFixed(0) }}%</div>
        </div>
    </div>

    <div v-else class="guess-input">
        <GuessInput :wordIndex="guesses.length" @inputDone="inputDone" @goBack="removeLastGuess" />
    </div>

    <ShareModal v-if="completed" :visible="showShareModal" @close="showShareModal = false" :guesses="guesses"
        :completed="completed" :busted="busted" :hardMode="hardMode" :finalLetterGrade="finalLetterGrade"
        :puzzleDate="puzzleDate" :puzzleAnswer="puzzleAnswer" :shareURL="shareURL" />
</template>

<style scoped>
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
