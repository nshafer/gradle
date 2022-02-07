<script>
import Solver from '../solver.js';

const validLettersRegex = /[^abcdefghijklmnopqrstuvwxyz]/ig;

const benchmarks = {};

function cleanLetters(val) {
    if (val && typeof val === "string") {
        return val.toLowerCase().replaceAll(validLettersRegex, "");
    } else {
        return "";
    }
}

export default {
    name: "Helper",
    data() {
        return {
            debug: false,
            benchmark: true,
            benchmarkResults: {},

            showResults: false,

            green1: null, green2: null, green3: null, green4: null, green5: null,
            yellow1: [], yellow2: [], yellow3: [], yellow4: [], yellow5: [],
            gray: [],
        }
    },
    computed: {
        greens() {
            return [
                this.parseGreen(this.green1),
                this.parseGreen(this.green2),
                this.parseGreen(this.green3),
                this.parseGreen(this.green4),
                this.parseGreen(this.green5),
            ]
        },
        yellows() {
            return [
                this.parseYellow(this.yellow1),
                this.parseYellow(this.yellow2),
                this.parseYellow(this.yellow3),
                this.parseYellow(this.yellow4),
                this.parseYellow(this.yellow5),
            ]
        },
        grays() {
            return this.parseGray(this.gray);
        },
        randomResult() {
            return this.results[Math.floor(Math.random() * this.results.length)];
        },
        results() {
            // console.log("solve", this.greens, this.yellows, this.grays);
            this.benchmarkStart("solve");
            // console.time("solve");
            const solver = new Solver(this.greens, this.yellows, this.grays);
            const words = solver.solve();
            this.benchmarkEnd("solve");
            // console.timeEnd("solve");
            return words;
        },
    },
    methods: {
        parseGreen(val) {
            val = cleanLetters(val);
            if (val) {
                return val;
            } else {
                return null;
            }
        },

        parseYellow(val) {
            val = cleanLetters(val);
            if (val) {
                return val.split("");
            } else {
                return [];
            }
        },
        parseGray(val) {
            val = cleanLetters(val);
            return val.split("");
        },
        benchmarkStart(name) {
            benchmarks[name] = window.performance.now();
        },
        benchmarkEnd(name) {
            const end = window.performance.now();
            const res = end - benchmarks[name];
            // console.log(`benchmark results for ${name}: ${res} ms`);
            this.benchmarkResults[name] = res;
        }
    },
}
</script>

<template>
    <form @submit.prevent="solve">
        <div class="section green">
            <p>Enter any green characters in their position</p>

            <div class="inputs green">
                <input v-model="green1" class="input char green" maxlength="1" type="text" spellcheck="false" />
                <input v-model="green2" class="input char green" maxlength="1" type="text" spellcheck="false" />
                <input v-model="green3" class="input char green" maxlength="1" type="text" spellcheck="false" />
                <input v-model="green4" class="input char green" maxlength="1" type="text" spellcheck="false" />
                <input v-model="green5" class="input char green" maxlength="1" type="text" spellcheck="false" />
            </div>
        </div>

        <div class="section yellow">
            <p>Enter any yellow letters in their position</p>

            <div class="inputs yellow">
                <input class="input chars yellow" maxlength="4" type="text" name="yellow1" spellcheck="false" v-model="yellow1" />
                <input class="input chars yellow" maxlength="4" type="text" name="yellow2" spellcheck="false" v-model="yellow2" />
                <input class="input chars yellow" maxlength="4" type="text" name="yellow3" spellcheck="false" v-model="yellow3" />
                <input class="input chars yellow" maxlength="4" type="text" name="yellow4" spellcheck="false" v-model="yellow4" />
                <input class="input chars yellow" maxlength="4" type="text" name="yellow5" spellcheck="false" v-model="yellow5" />
            </div>
        </div>

        <div class="section gray">
            <p>Enter any dark gray letters anywhere</p>

            <input class="input line gray" maxlength="26" type="text" name="grays" spellcheck="false" v-model="gray" />
        </div>
    </form>

    <div v-if="results != null" class="section results">
        <div v-if="results.length > 1000">
            <p>There are <strong>over 1000</strong> possible answers! Here is a random possible word to try next. </p>

            <ul class="wordlist">
                <li class="word">{{ randomResult }}</li>
            </ul>
        </div>
        <div v-else-if="results.length > 9">
            <p>There are <strong>{{ results.length }}</strong> possible answers! Here is a random possible word to try next. </p>

            <ul class="wordlist">
                <li class="word">{{ randomResult }}</li>
            </ul>
        </div>
        <div v-else-if="results.length > 1">
            <p>There are only {{ results.length }} possible answers. It has to be one of these:</p>
            <ul class="wordlist">
                <li v-for="word in results" :key="word" class="word">
                    {{ word }}
                </li>
            </ul>
        </div>
        <div v-else-if="results.length == 1">
            <p>There is only one possible answer:</p>

            <ul class="wordlist">
                <li class="word correct">{{ results[0] }}</li>
            </ul>
        </div>
        <div v-else>
            <p>No results found. Please check your input and try again!</p>
        </div>
    </div>

    <div v-if="debug" class="debug">
        Greens: {{ greens }}<br/>
        Yellows: {{ yellows }}<br/>
        Grays: {{ grays }}<br/>
    </div>

    <div v-if="benchmark">
        Solve: {{ parseFloat(benchmarkResults["solve"]).toFixed(1) }} ms
    </div>
</template>

<style scoped>
.section {
    padding: .75em .5em;
    margin-bottom: 1em;
    background: var(--gray-5);
    border: 1px solid transparent;
}

.section.green {
    /* border-color: var(--color-correct); */
}

.section.yellow {
    /* border-color: var(--color-present); */
}

.section.gray {
    /* border-color: var(--color-absent); */
}

.section h1 {
    text-align: center;
    font-size: 1.1em;
    margin: 0 1em .25em;
}

.section p {
    text-align: center;
    margin: 0 1em 1em;
}

.inputs {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
}

.input {
    background: var(--tile-bg);
    width: 100%;
    height: 1.5em;
    font-size: 1em;
    color: var(--tile-text-color);
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    border: none;
    transition: all 100ms;
}

@media screen and (min-width: 25em) {
    .input {
        font-size: 1.2em;
    }
}

@media screen and (min-width: 30em) {
    .input {
        font-size: 1.5em;
    }
}

.input + .input {
    margin-left: .5em;
}

.input.char {
    width: 1.5em;
}

.input.chars {
    resize: none;
    /* height: 3em; */
    vertical-align: middle;
    width: 3em;
}

.input.line {
    letter-spacing: .25em;
}

.input.green {
    background: var(--color-correct);
    color: var(--tile-evaluated-text-color);
}

.input.yellow {
    background: var(--color-present);
    color: var(--tile-evaluated-text-color);
}

.input.gray {
    background: var(--color-absent);
    color: var(--tile-evaluated-text-color);
}

.input:focus {
    font-size: 2em;
    /* transform: scale(2); */
}

.input.line:focus {
    transform: scale(1);
    font-size: 2em;
}

.buttons {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    margin-bottom: 1em;
}

.button {
    background: var(--gray-3);
    padding: .5em 1em;
    width: auto;
    height: auto;
    border-radius: 5px;
}

.results {
    font-size: 1.2em;
}

.results p {
    margin-bottom: 0;
}

.wordlist {
    margin: -.5em;
    padding: .5em 1em;
    list-style: none;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
}

strong {
    font-size: 1.2em;
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
