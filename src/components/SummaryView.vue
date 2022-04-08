<script setup lang="ts">
import { ref } from 'vue';
import type { Guess } from "@/guess";
import IconAngleLeft from "./icons/IconAngleLeft.vue";
import GuessDisplay from "./GuessDisplay.vue";
import IconCaretRight from "./icons/IconCaretRight.vue";
import IconCircleInfo from "./icons/IconCircleInfo.vue";
import ToolTip from "./ToolTip.vue";
import IconFilterList from "./icons/IconFilterList.vue";
import WordListModal from "./WordListModal.vue";

defineProps<{
    guess: Guess | undefined
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
                                    <button class="button icon"><IconCircleInfo /></button>
                                    <template #content>
                                        This guess reduced the list of words from
                                        <b>{{ guess.previousWordsRemaining.length }}</b>
                                        to
                                        <b>{{ guess.wordsRemaining.length }}</b>
                                        which is a reduction of
                                        <b>{{ (guess.wordReductionPercent*100).toFixed(2) }}%</b>.

                                        <p>
                                            <small>w<sub>p</sub></small> = {{ guess.previousWordsRemaining.length }}
                                            <br/>
                                            <small>w<sub>n</sub></small> = {{ guess.wordsRemaining.length }}
                                        </p>
                                    </template>
                                </ToolTip>
                            </div>
                        </div>
                        <div class="detail-value">
                            <span>
                                {{ guess.previousWordsRemaining.length }}
                                <div class="icon-inline"><IconCaretRight /></div>
                                {{ guess.wordsRemaining.length }}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail">
                        <div class="detail-label">
                            Bits
                            <ToolTip>
                                <button class="button icon">
                                    <IconCircleInfo />
                                </button>
                                <template #content>
                                    The <i>bits of entropy</i> is a measure of how many
                                    times the list of possible words was cut in half,
                                    over and over.
                                    This guess cut the list of words in half
                                    {{ guess.bits.toFixed(2) }}
                                    times, making it roughly 1/{{ guess.fractional.toFixed(0) }} in size.

                                    <p>
                                        <small>b</small> = log<sub>2</sub>(1 / <small>p</small>)
                                        = {{ guess.bits.toFixed(4) }}
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
                                    Uncertainty is another way of saying how many <i>bits of entropy</i>
                                    exist in the number of words that were in the list before this guess.
                                    Or put another way, it would take
                                    {{ guess.bits.toFixed(2) }} <i>bits of entropy</i> to reduce the list
                                    of words to 1 final possibility.

                                    <p>
                                        <small>u</small> = log<sub>2</sub>(<small>w<sub>p</sub></small>)
                                        = {{ guess.uncertainty.toFixed(4) }}
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
                                    {{ (guess.probability*100).toFixed(2) }}%
                                    chance that this guess would reduce the list as much as it did.
                                    The lower the probability, the more <i>bits of entropy</i> in this guess,
                                    and the higher your final grade.

                                    <p>
                                        <small>p</small> = <small>W<sub>p</sub></small> / <small>W<sub>n</sub></small>
                                        = {{ guess.probability.toFixed(8) }}
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
                                    Each <i>bit of entropy</i> is exponentially more difficult to attain,
                                    so the final grade for this guess is the percent of the
                                    <b>Bits of entropy</b> out of the <b>Uncertainty</b> plotted on an
                                    exponential curve.
                                    <p>
                                        <small>g<sub>p</sub></small> = <small>b</small> / <small>u</small>
                                        =
                                        {{ guess.percentage.toFixed(4) }}
                                    </p>
                                    <p>
                                        <small>g<sub>f</sub></small>
                                        =
                                        1 -
                                        (1 - <small>g<sub>p</sub></small>)
                                        <sup>2</sup>
                                        =
                                        {{ guess.grade.toFixed(4) }}
                                    </p>
                                </template>
                            </ToolTip>
                        </div>
                        <div class="detail-value grade-color" :class="[guess.letterGradeSimple]">
                            {{ (guess.grade*100).toFixed(2) }}%
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
                                        <i>bits of entropy</i> that letter provides to the final answer.
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
                                <div class="icon-inline"><IconCaretRight /></div>
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
                <div class="instruction-text">Select which puzzle you want graded.</div>
            </div>
            <div class="instruction">
                <div class="instruction-step">2</div>
                <div class="instruction-text">Enter each of your guesses.</div>
            </div>
        </div>
    </div>

    <WordListModal v-if="guess" :visible="showWordListModal" @close="showWordListModal = false" :words="guess.wordsRemaining" />
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
