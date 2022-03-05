<script lang="ts">
import { defineComponent } from 'vue';

import { shuffleArray } from '@/util';
import ObscuredWord from './ObscuredWord.vue';
import ObscuredLetters from './ObscuredLetters.vue';

const numAnswersShown = 4;
const numSuggestionsShown = 4;

export default defineComponent({
    name: "ResultsView",
    props: ["hasInput", "solver", "answers"],
    components: {
        ObscuredWord,
        ObscuredLetters,
    },
    data() {
        return {
            showAnswer: false,
            showSuggestion: false,
        }
    },
    computed: {
        shuffledAnswers(): string[] {
            return (this.answers);
        },
        randomAnswer(): string {
            if (this.shuffledAnswers.length > 0) {
                return this.shuffledAnswers[0];
            } else {
                return "none!";
            }
        },
        randomAnswers(): string[] {
            return this.shuffledAnswers.slice(0, numAnswersShown);
        },
        shuffledSuggestions(): string[] {
            if (this.solver != null) {
                return shuffleArray(this.solver.suggest());
            } else {
                return [];
            }
        },
        randomSuggestion(): string {
            if (this.shuffledSuggestions.length > 0) {
                return this.shuffledSuggestions[0];
            } else {
                return "none!"
            }
        },
        randomSuggestions(): string[] {
            return this.shuffledSuggestions.slice(0, numSuggestionsShown);
        }
    },
    methods: {
    },
});
</script>

<template>
    <div class="section results mb-0">
        <div class="section__header">
            <h1>Results</h1>
        </div>
        
        <div v-if="hasInput && answers.length > 0" class="section__body">
            <div class="text-center" v-if="answers.length > 10">
                <h2>There are <strong><b>{{ answers.length }}</b></strong> possible answers!</h2>
                
                <p>Here are a few random possible answers to try next.</p>
                <ul class="wordlist mb-3">
                    <li v-for="word in randomAnswers" :key="word" class="word">
                        <ObscuredWord :key="word" :word="word" />
                    </li>
                </ul>
                
                <template v-if="randomSuggestions.length > 0">
                    <p class="mb-0">Here are a few random 5-letter words that are not an answer.</p>
                    <p>Enter one of these to get more information without solving the puzzle.</p>
                    <ul class="wordlist">
                        <li v-for="word in randomSuggestions" :key="word" class="word">
                            <ObscuredWord :key="word" :word="word" />
                        </li>
                    </ul>
                </template>
            </div>
            <div class="text-center" v-else-if="answers.length > 1">
                <h2>There are only <strong><b>{{ answers.length }}</b></strong> possible answers!</h2>

                <p>Here is a random possible word to try next.</p>
                <ul class="wordlist mb-3">
                    <li v-for="word in answers" :key="word" class="word">
                        <ObscuredWord :key="word" :word="word" />
                    </li>
                </ul>

                <template v-if="randomSuggestions.length > 0">
                    <p class="mb-0">Here are a few random 5-letter words that are <b>NOT</b> the answer.</p>
                    <p>Enter one of these to get more information without solving the puzzle.</p>
                    <ul class="wordlist">
                        <li v-for="word in randomSuggestions" :key="word" class="word">
                            <ObscuredWord :key="word" :word="word" />
                        </li>
                    </ul>
                </template>
            </div>
            <div class="text-center" v-else-if="answers.length == 1">
                <h2>There is only <strong><b>ONE</b></strong> possible answer.</h2>
                <p>Click on each letter to reveal it.</p>
                <ObscuredLetters :key="answers[0]" :word="answers[0]" :solver="solver" />
            </div>
            <div v-else class="empty">
            </div>
        </div>

        <div v-else-if="hasInput && answers.length == 0" class="section__body empty">
            <h2>No answers found!</h2>
            <p>
                Please check your input and try again!<br/>
                Remember that the position of letters is important!
            </p>
        </div>

        <div v-else class="section__body empty">
            <p>
                Input the letters from your puzzle to narrow down which word it might be.
            </p>
        </div>
    </div>
</template>

<style scoped>
.wordlist {
    margin: -.5em;
    padding: .5em 1em;
    list-style: none;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    font-size: 1.25em
}

.word {
    margin: .5em;
    /* padding: .25em 1em; */
    background: var(--color-absent);
    color: var(--input-text-color);
    text-transform: uppercase;
    min-width: 6em;
}

.word.correct {
    background: var(--color-correct);
}

.section.results .section__body {
    min-height: 458px;
}

.empty {
    padding: 20%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center
}

</style>
