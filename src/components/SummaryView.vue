<script setup lang="ts">
import { ref } from 'vue';
import type { Guess } from "@/guess";

import GuessDisplay from "./GuessDisplay.vue";
import ToolTip from "./ToolTip.vue";
import WordListModal from "./WordListModal.vue";

import IconAngleLeft from "./icons/IconAngleLeft.vue";
import IconCaretRight from "./icons/IconCaretRight.vue";
import IconCircleInfo from "./icons/IconCircleInfo.vue";
import IconFilterList from "./icons/IconFilterList.vue";

defineProps<{
    guess: Guess | undefined,
}>();

defineEmits(["backClicked"]);

const showWordListModal = ref(false);

</script>

<template>
    <div class="summary">
        <div v-if="guess" class="sheet">
            <div class="header" :class="[guess.letterGradeSimple]">
                <div class="word">
                    <GuessDisplay :guess="guess" />
                </div>

                <div class="grade grade-color" :class="[guess.letterGradeSimple]">
                    <div class="letter">{{ guess.letterGrade }}</div>
                </div>
            </div>

            <div class="body">
                <div class="detail-row">
                    <div class="detail">
                        <div class="detail-label">
                            Possible Words
                            <div class="detail-buttons">
                                <button class="button icon" @click="showWordListModal = true">
                                    <IconFilterList />
                                </button>

                                <ToolTip>
                                    <button class="button icon">
                                        <IconCircleInfo />
                                    </button>
                                    <template #content>
                                        This guess reduced the list of possible words (<small>w<sub>p</sub></small>)
                                        from
                                        <b>{{ guess.previousWordsRemaining.length }}</b>
                                        to
                                        <b>{{ guess.wordsRemaining.length }}</b>
                                        remaining words (<small>w<sub>r</sub></small>)
                                        which is a reduction of
                                        <b>{{ (guess.wordReductionPercent*100).toFixed(2) }}%</b>.

                                        <p>
                                            <small>w<sub>p</sub></small> = {{ guess.previousWordsRemaining.length }}
                                            <br />
                                            <small>w<sub>r</sub></small> = {{ guess.wordsRemaining.length }}
                                        </p>
                                    </template>
                                </ToolTip>
                            </div>
                        </div>
                        <div class="detail-value">
                            <span>
                                {{ guess.previousWordsRemaining.length }}
                                <div class="icon-inline">
                                    <IconCaretRight />
                                </div>
                                {{ guess.wordsRemaining.length }}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="detail-row">
                    <div class="detail">
                        <div class="detail-label">
                            Bits of Info
                            <ToolTip>
                                <button class="button icon">
                                    <IconCircleInfo />
                                </button>
                                <template #content>
                                    The <i>bits of information</i> (<small>b</small>) is a measure of how many
                                    times the list of words was cut in half.
                                    The more times it's cut in half, the better this guess was at finding the eventual
                                    answer.
                                    This guess cut the list of words in half
                                    <b>{{ guess.bits.toFixed(2) }}</b>
                                    times, making it roughly <b>1/{{ guess.fractional.toFixed(0) }}</b> in size.

                                    <p>
                                        <small>b</small> = log<sub>2</sub>(1 / <small>p</small>)
                                        <br />
                                        <small>b</small> = log<sub>2</sub>(1 / {{ guess.probability.toFixed(8) }})
                                        <br />
                                        <small>b</small> = {{ guess.bits.toFixed(4) }}
                                    </p>
                                </template>
                            </ToolTip>
                        </div>
                        <div class="detail-value">
                            {{ guess.bits.toFixed(2) }}
                        </div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">
                            Uncertainty
                            <ToolTip>
                                <button class="button icon">
                                    <IconCircleInfo />
                                </button>
                                <template #content>
                                    Uncertainty (<small>u</small>) is another way of saying how many
                                    <i>bits of information</i> (<small>b</small>)
                                    exist in the number of words that were in the list before this guess.
                                    Or put another way, it would take
                                    <b>{{ guess.uncertainty.toFixed(2) }}</b> <i>bits of information</i>
                                    to reduce the list of words to 1 remaining word.

                                    <p>
                                        <small>u</small> = log<sub>2</sub>(<small>w<sub>p</sub></small>)
                                        <br />
                                        <small>u</small> = log<sub>2</sub>({{ guess.previousWordsRemaining.length }})
                                        <br />
                                        <small>u</small> = {{ guess.uncertainty.toFixed(4) }}
                                    </p>
                                </template>
                            </ToolTip>
                        </div>
                        <div class="detail-value">
                            {{ guess.uncertainty.toFixed(2) }}
                        </div>
                    </div>
                </div>

                <div class="detail-row">
                    <div class="detail">
                        <div class="detail-label">
                            Probability
                            <ToolTip>
                                <button class="button icon">
                                    <IconCircleInfo />
                                </button>
                                <template #content>
                                    There was a
                                    <b>{{ (guess.probability*100).toFixed(2) }}%</b>
                                    (<b>1 in {{ guess.fractional.toFixed(0) }}</b>)
                                    chance that this guess would reduce the list as much as it did.
                                    The lower the probability (<small>p</small>), the more <i>bits of information</i> in
                                    this guess, and the higher your final grade.

                                    <p>
                                        <small>p</small> = <small>W<sub>r</sub></small> / <small>W<sub>p</sub></small>
                                        <br />
                                        <small>p</small> = {{ guess.wordsRemaining.length }} /
                                        {{ guess.previousWordsRemaining.length }}
                                        <br />
                                        <small>p</small> = {{ guess.probability.toFixed(8) }}
                                    </p>
                                </template>
                            </ToolTip>
                        </div>
                        <div class="detail-value">
                            1 in {{ guess.fractional.toFixed(0) }}
                        </div>
                    </div>
                    <div class="detail">
                        <div class="detail-label">
                            Grade
                            <ToolTip>
                                <button class="button icon">
                                    <IconCircleInfo />
                                </button>
                                <template #content>
                                    Each <i>bit of information</i> (<small>b</small>) is exponentially more difficult to
                                    attain, so the percentage grade (<small>g<sub>p</sub></small>) for this guess is the
                                    percent of the
                                    <b>Bits of information</b> (<small>b</small>) out of the
                                    <b>Uncertainty</b> (<small>u</small>)
                                    plotted on an exponential curve (<small>g<sub>c</sub></small>) to get a fair grade
                                    for this guess.
                                    <p>
                                        <small>g<sub>p</sub></small> = <small>b</small> / <small>u</small>
                                        <br />
                                        <small>g<sub>p</sub></small> = {{ guess.bits.toFixed(4) }} / {{
                                        guess.uncertainty.toFixed(4) }}
                                        <br />
                                        <small>g<sub>p</sub></small> = {{ guess.percentage.toFixed(4) }}
                                    </p>
                                    <p>
                                        <small>g<sub>c</sub></small> = 1 - (1 - <small>g<sub>p</sub></small>)
                                        <sup>2</sup>
                                        <br />
                                        <small>g<sub>c</sub></small> = {{ guess.grade.toFixed(4) }}
                                    </p>
                                </template>
                            </ToolTip>
                        </div>
                        <div class="detail-value grade-color" :class="[guess.letterGradeSimple]">
                            <template v-if="guess.grade == 1">
                                100%
                            </template>
                            <template v-else>
                                {{ (guess.grade*100).toFixed(2) }}%
                            </template>
                        </div>
                    </div>
                </div>

                <table class="letter-table mb-3">
                    <thead>
                        <tr>
                            <th>
                                Letter
                                <ToolTip class="tooltip">
                                    <button class="button icon">
                                        <IconCircleInfo />
                                    </button>
                                    <template #content>
                                        For each letter, show how many possible words were reduced and the
                                        <i>bits of information</i> that letter provides to the final answer.
                                        Letters are resolved in a specific order, Correct, Present then Absent.
                                    </template>
                                </ToolTip>
                            </th>
                            <th>Words</th>
                            <th>Reduction</th>
                            <th>Bits</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="letter in guess.letters" :key="letter.index">
                            <th>
                                <span class="text-muted">
                                    {{ letter.resolutionIndex! + 1 }}:
                                </span>

                                <div class="tile" :class="letter.hint">
                                    {{ letter.letter }}
                                </div>
                            </th>
                            <td>
                                {{ letter.previousWordsRemaining.length }}
                                <div class="icon-inline">
                                    <IconCaretRight />
                                </div>
                                {{ letter.wordsRemaining.length }}
                            </td>
                            <td>
                                {{ (letter.wordReductionPercent*100).toFixed(1) }}%
                            </td>
                            <td>
                                {{ letter.bits.toFixed(2) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="footer">
                <div class="buttons">
                    <button class="return button with-icon-left" @click="$emit('backClicked')">
                        <IconAngleLeft /> Back
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="no-guesses">
            <h3>Quick Start</h3>

            <div class="instruction">
                <div class="instruction-step">1</div>
                <div class="instruction-text">
                    Play wordle in the official Wordle app.
                    <div class="text-muted">This tool is not meant for playing wordle.</div>
                </div>
            </div>

            <div class="instruction">
                <div class="instruction-step">2</div>
                <div class="instruction-text">
                    Select which puzzle you want graded. Default is today.
                    <div class="text-muted">Choose by date or by entering the answer.</div>
                </div>
            </div>

            <div class="instruction">
                <div class="instruction-step">3</div>
                <div class="instruction-text">
                    Enter each of your guesses in order.
                    <div class="text-muted">
                        Each guess will be graded. Click on it for more info.
                    </div>
                </div>
            </div>

            <div class="instruction">
                <div class="instruction-step">4</div>
                <div class="instruction-text">
                    Get your final grade!
                    <div class="text-muted">
                        Share it with a unique link for discord, reddit, markdown, etc.
                    </div>
                </div>
            </div>

            <div class="instruction">
                <div class="instruction-step">5</div>
                <div class="instruction-text">
                    Your wordle answers and grades are saved on this device.
                    <div class="text-muted">
                        See your puzzle history with the history button in the top right.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <WordListModal v-if="guess" :visible="showWordListModal" @close="showWordListModal = false"
        :words="guess.wordsRemaining" />
</template>

<style scoped>
    .summary {
        background: var(--page-bg);
    }

    .sheet {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
    }

    .body {
        padding: .5em;
    }

    .header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background: var(--detail-label-bg);
        color: var(--detail-label-fg);
    }

    .word {
        font-size: 1.5em;
        padding: .25em .5em;
    }

    .detail-row {
        display: flex;
        flex-flow: row wrap;
        margin: 0 -.25em;
    }

    .detail {
        flex: 1 0 0%;
        width: 100%;
        margin: .25em;
        display: flex;
        flex-flow: row nowrap;
        justify-content: stretch;
    }

    .detail-label {
        background: var(--detail-label-bg);
        color: var(--detail-label-fg);
        flex-grow: 1;
        padding: .25em 0 .25em .5em;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
    }

    .detail-value {
        background: var(--detail-value-bg);
        color: var(--detail-value-fg);
        font-weight: bold;
        padding: .25em .5em;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
        white-space: nowrap;
    }

    .detail-buttons {
        display: flex;
        flex-flow: row nowrap;
    }
    
    .detail-unit {
        font-size: .8em;
        font-style: italic;
    }

    .footer {
        background: var(--detail-label-bg);
        color: var(--detail-label-fg);
        padding: .5em;
    }

    .no-guesses {
        padding: 2em 3em;
    }

    .no-guesses h3 {
        margin: 0 0 1em;
    }

    .instruction {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        margin-bottom: 1em;
    }

    .instruction-step {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        background: var(--detail-label-bg);
        color: var(--detail-label-fg);
        padding: .25em;
        font-size: 1.5em;
        font-weight: bold;
        width: 1.5em;
        margin-right: .5em;
    }

    .letter-details {
        overflow-x: auto;
    }

    .letter-table {
        width: 100%;
        border-collapse: collapse;
    }

    .letter-table thead .tooltip {
        vertical-align: middle;
    }

    .letter-table th, .letter-table td {
        padding: .3em;
        vertical-align: middle;
        text-align: center;
        white-space: nowrap;
    }

    .letter-table tbody th {
        background: var(--detail-label-bg);
        color: var(--detail-label-fg);
        width: 20%;
    }
    
    .letter-table tbody td {
        background: var(--detail-value-bg);
        color: var(--detail-value-fg);
        width: calc(80%/3);
    }

    .button.icon {
        padding: .5em .25em;
        min-width: auto;
    }
    
    .button.return {
        padding-left: 1.5rem;
    }

    /* Small screens only */
    @media screen and (max-width: 69.9375em) {
        .summary {
            height: 100%;
        }
        
        .body {
            flex-grow: 1;
        }
    }

    /* Large screens only */
    @media screen and (min-width: 70em) {
        .body {
            padding: 1em;
        }
        
        .footer {
            display: none;
            padding: 1em;
        }
    }
    
    @media screen and (min-width: 30em) {
        .detail-label {
            padding: .25em .5em;
        }

        .detail-value {
            padding: .25em .75em;
        }
    }
</style>
