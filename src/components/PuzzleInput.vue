<script setup lang="ts">
import { ref, watch, computed, onUpdated, nextTick } from 'vue';
import { Guess } from '@/guess';

import GuessInput from './GuessInput.vue';
import GuessDisplay from './GuessDisplay.vue';
import AnswerPicker from './AnswerPicker.vue';
import ToolTip from './ToolTip.vue';

import IconTrash from './icons/IconTrash.vue';
import IconAngleRight from './icons/IconAngleRight.vue';
import IconCaretRight from "./icons/IconCaretRight.vue";
import IconCircleInfo from "./icons/IconCircleInfo.vue";
import { dateIndex, letterGrade, letterGradeSimple } from '@/game';
import { encodeShareCode } from '@/encoding';

const props = defineProps<{
    guesses: Guess[]
    selectedGuess?: Guess
    answer?: string,
    date?: Date,
}>();

console.log("PuzzleInput guesses", props.guesses);

const emit = defineEmits<{
    (e: 'appendGuess', guess: Guess): void
    (e: 'removeGuess', index: number): void
    (e: 'guessClicked', guess: Guess): void
}>();

const puzzleAnswer = ref(props.answer || "");
const puzzleDate = ref(props.date);

function appendGuess(word: string) {
    const guessIndex = props.guesses.length;
    const previous = guessIndex > 0 ? props.guesses[guessIndex - 1] : undefined;
    const guess = new Guess(word, guessIndex, puzzleAnswer.value, previous);
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

// Remove all guesses if the answer changes
watch(puzzleAnswer, (newAnswer, oldAnswer) => {
    if (newAnswer !== oldAnswer) {
        emit('removeGuess', 0);
    }
});

function guessClicked(guess: Guess) {
    // console.log("PuzzleInput.guessClicked", guess)
    emit('guessClicked', guess);
}

//
// Some helpful computed values
//

const completed = computed(() => {
    return props.guesses.length >= 6 || props.guesses[props.guesses.length - 1]?.isCorrect;
});

const hardMode = computed(() => {
    if (props.guesses.length > 0) {
        return props.guesses[props.guesses.length - 1].hardMode;
    } else {
        return true;
    }
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

//
// Share functionality
//

const showCopiedTooltip = ref(false);

const shareText = computed(() => {
    let hashtag: string;
    if (puzzleDate.value != null) {
        hashtag = "#Wordle" + dateIndex(puzzleDate.value!);
    } else {
        hashtag = "#Wordle";
    }

    const guessCount = `${props.guesses.length}/6`;
    const hard = hardMode.value ? "*" : "";

    let guessLines = [];
    for (let guess of props.guesses) {
        guessLines.push(`${guess.unicodeHints}  ${guess.letterGrade}`)
    }

    return `${hashtag} ${guessCount}${hard} Grade: ${finalLetterGrade.value}

${guessLines.join("\n")}
`
});

const shareURL = computed(() => {
    const url = new URL(window.location.href);
    if (completed.value) {
        const words = props.guesses.map(value => value.word);
        url.hash = encodeShareCode(words, puzzleDate.value, puzzleAnswer.value);
    } else {
        url.hash = "";
    }
    return url.toString();
})

async function share() {
    const data = {
        text: shareText.value,
        url: shareURL.value,
    }
    console.log("share", data);

    if (navigator.share != undefined && navigator.canShare && navigator.canShare(data)) {
        await navigator.share(data);
    } else if (navigator.clipboard && navigator.clipboard.writeText != undefined) {
        await navigator.clipboard.writeText(data.text + "\n" + data.url);
        showCopiedTooltip.value = true;
        setTimeout(() => { showCopiedTooltip.value = false; }, 2000);
    }
}

watch(() => props.guesses, (newGuesses) => {
    history.replaceState(null, "", shareURL.value);
});

</script>

<template>
    <AnswerPicker v-model:date="puzzleDate" v-model:answer="puzzleAnswer" />

    <template v-if="puzzleAnswer">
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
                                {{ guesses.length }} / 6 Guesses.
                            </div>
                            <div v-if="hardMode">
                                Hard mode.
                            </div>
                        </div>
                    </div>
                </div>

                <ToolTip :show="showCopiedTooltip">
                    <button class="share-button button primary" @click="share">
                        Share
                    </button>
                    <template #content>
                        Copied results to clipboard
                    </template>
                </ToolTip>
            </div>

            <div class="grade grade-color" :class="[finalLetterGradeSimple]">
                <div class="letter">{{ finalLetterGrade }}</div>
                <div class="label">{{ (finalGrade*100).toFixed(0) }}%</div>
            </div>
        </div>

        <div v-else class="guess-input">
            <GuessInput :wordIndex="guesses.length" @inputDone="inputDone" @goBack="removeLastGuess" />
        </div>
    </template>

    <!--
    <p>Puzzle Date: {{ puzzleDate }}</p>
    <p>Puzzle Answer: {{ puzzleAnswer }}</p>
    <ul>
        <li v-for="guess in guesses" :key="guess.index">
            {{ guess.word }}
        </li>
    </ul>
    -->
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
