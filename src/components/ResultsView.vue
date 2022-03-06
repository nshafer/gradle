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
    <div class="results-view">
        <template v-if="hasInput && answers.length > 10">
            <div class="section" :class="{ 'mb-0': randomSuggestions.length == 0 }">
                <div class="section__header">
                    <h1>{{ answers.length }} Possible Answers</h1>
                </div>
                
                <div class="section__body text-center">
                    <p>Here are some random possible answers to try next.</p>

                    <ul class="wordlist">
                        <li v-for="word in randomAnswers" :key="word" class="word">
                            <ObscuredWord :key="word" :word="word" />
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="randomSuggestions.length > 0" class="section mb-0">
                <div class="section__header">
                    <h1>Other Dictionary Words</h1>
                </div>
                
                <div class="section__body text-center">
                    <p class="">Here are a few random 5-letter words that are NOT the answer.</p>
                    
                    <ul class="wordlist mb-2">
                        <li v-for="word in randomSuggestions" :key="word" class="word">
                            <ObscuredWord :key="word" :word="word" />
                        </li>
                    </ul>

                    <p>Enter one of these to get more information without solving the puzzle.</p>
                </div>
            </div>
        </template>

        <template v-else-if="hasInput && answers.length > 1">
            <div class="section" :class="{ 'mb-0': randomSuggestions.length == 0 }">
                <div class="section__header">
                    <h1>Only {{ answers.length }} Possible Answers</h1>
                </div>
                
                <div class="section__body text-center">
                    <p>The answer will be one of these words.</p>
                    
                    <ul class="wordlist mb-1">
                        <li v-for="word in answers" :key="word" class="word">
                            <ObscuredWord :key="word" :word="word" />
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="randomSuggestions.length > 0" class="section mb-0">
                <div class="section__header">
                    <h1>Other Dictionary Words</h1>
                </div>
                
                <div class="section__body text-center">
                    <p class="">Here are a few random 5-letter words that are NOT the answer.</p>
                    
                    <ul class="wordlist mb-2">
                        <li v-for="word in randomSuggestions" :key="word" class="word">
                            <ObscuredWord :key="word" :word="word" />
                        </li>
                    </ul>

                    <p>Enter one of these to get more information without solving the puzzle.</p>
                </div>
            </div>
        </template>

        <template v-else-if="hasInput && answers.length == 1">
            <div class="section mb-0">
                <div class="section__header">
                    <h1>Answer Found</h1>
                </div>
                
                <div class="section__body text-center">
                    <p class="mt-3">Click on each letter to reveal it.</p>

                    <ObscuredLetters :key="answers[0]" :word="answers[0]" :solver="solver" />
                </div>
            </div>
        </template>

        <template v-else-if="hasInput && answers.length == 0">
            <div class="section mb-0">
                <div class="section__header">
                    <h1>No Answer Found</h1>
                </div>
                
                <div class="section__body text-center empty">
                    <p>
                        Please check your input and try again!<br/>
                        Remember that the position of letters is important!
                    </p>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="section mb-0">
                <div class="section__header">
                    <h1>Results</h1>
                </div>
                
                <div class="section__body text-center empty">
                    <p>
                        Input the letters from your puzzle to narrow down which word it might be.
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.results-view {
    display: flex;
    flex-flow: column nowrap;
    justify-content: stretch;
    height: 100%;
    max-height: 40em;
}

.section {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
}

.section__body {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
}

.wordlist {
    margin: -.5em;
    padding: .5em 1em;
    list-style: none;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
}

.word {
    margin: .5em;
    background: var(--color-absent);
    color: var(--input-text-color);
    text-transform: uppercase;
    min-width: 6em;
}

.word.correct {
    background: var(--color-correct);
}

.empty {
    padding: 20%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
}

</style>
