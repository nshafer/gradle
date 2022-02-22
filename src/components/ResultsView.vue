<script lang="ts">
import { defineComponent } from 'vue';

// import Solver from '../solver.js';

export default defineComponent({
    name: "ResultsView",
    props: ["hasInput", "answers"],
    components: {
    },
    data() {
        return {
        }
    },
    computed: {
        randomResult() {
            return this.answers[Math.floor(Math.random() * this.answers.length)];
        },
    },
    methods: {
    },
});
</script>

<template>
    <div v-if="hasInput" class="section results">
        <div class="section__body">
            <div v-if="answers.length > 1000">
                <h2>There are <strong>over 1000</strong> possible answers!</h2>

                <p>Here is a random possible word to try next.</p>

                <ul class="wordlist">
                    <li class="word">{{ randomResult }}</li>
                </ul>
            </div>
            <div v-else-if="answers.length > 9">
                <h2>There are <strong>{{ answers.length }}</strong> possible answers!</h2>

                <p>Here is a random possible word to try next.</p>

                <ul class="wordlist">
                    <li class="word">{{ randomResult }}</li>
                </ul>
            </div>
            <div v-else-if="answers.length > 1">
                <h2>There are only {{ answers.length }} possible answers.</h2>

                <p>It has to be one of these:</p>
                
                <ul class="wordlist">
                    <li v-for="word in answers" :key="word" class="word">
                        {{ word }}
                    </li>
                </ul>
            </div>
            <div v-else-if="answers.length == 1">
                <h2>There is only one possible answer:</h2>

                <ul class="wordlist">
                    <li class="word correct">{{ answers[0] }}</li>
                </ul>
            </div>
            <div v-else>
                <p>No answers found. Please check your input and try again!</p>
            </div>
        </div>
    </div>
    <div v-else class="section results">
        <div class="section__body">
            <h2>
                Input the letters from your puzzle to narrow down which word it might be.
            </h2>
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
    font-size: 1.3em
}

.word {
    margin: .5em;
    padding: .25em 1em;
    background: var(--color-absent);
    text-transform: uppercase;
}

.word.correct {
    background: var(--color-correct);
}

</style>
