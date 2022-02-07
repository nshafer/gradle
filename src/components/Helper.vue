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

            green1: "", green2: "", green3: "", green4: "", green5: "",
            yellow1: "", yellow2: "", yellow3: "", yellow4: "", yellow5: "",
            gray: "",
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
        hasInput() {
            return this.green1 || this.green2 || this.green3 || this.green4 || this.green5
                || this.yellow1 || this.yellow2 || this.yellow3 || this.yellow4 || this.yellow5
                || this.gray;
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
        selectAll(event) {
            console.log("selectAll", event);
            event.target.select();
        },
        cursorEnd(event) {
            console.log("cursorEnd", event);
            const length = event.target.value.length;
            event.target.setSelectionRange(length, length);

        },
        benchmarkStart(name) {
            benchmarks[name] = window.performance.now();
        },
        benchmarkEnd(name) {
            const end = window.performance.now();
            const res = end - benchmarks[name];
            // console.log(`benchmark results for ${name}: ${res} ms`);
            this.benchmarkResults[name] = res;
        },
        resetGreen() {
            this.green1 = "";
            this.green2 = "";
            this.green3 = "";
            this.green4 = "";
            this.green5 = "";
        },
        resetYellow() {
            this.yellow1 = "";
            this.yellow2 = "";
            this.yellow3 = "";
            this.yellow4 = "";
            this.yellow5 = "";
        },
        resetGray() {
            this.gray = "";
        }
    },
}
</script>

<template>
    <div v-if="hasInput" class="result-count">
        <p>
            <b>{{ results.length }}</b> possible answers.
        </p>
    </div>
    <div v-else class="result-count">
        <p>
            Enter the letters from your puzzle
        </p>
    </div>

    <form @submit.prevent="solve">
        <div class="section green">
            <div class="section__header">
                <h1>Correct Letters</h1>
                <button class="button reset" @click.prevent="resetGreen">
                    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h18.9l33.2 372.3a48 48 0 0 0 47.8 43.7h232.2a48 48 0 0 0 47.8-43.7L421.1 96H440a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zm184.8 427a15.91 15.91 0 0 1-15.9 14.6H107.9A15.91 15.91 0 0 1 92 465.4L59 96h330z"></path></svg>
                </button>
            </div>

            <div class="section__body">
                <div class="inputs chars green">
                    <input v-model="green1" class="input char green" maxlength="1" type="text" spellcheck="false" @click="selectAll" />
                    <input v-model="green2" class="input char green" maxlength="1" type="text" spellcheck="false" @click="selectAll" />
                    <input v-model="green3" class="input char green" maxlength="1" type="text" spellcheck="false" @click="selectAll" />
                    <input v-model="green4" class="input char green" maxlength="1" type="text" spellcheck="false" @click="selectAll" />
                    <input v-model="green5" class="input char green" maxlength="1" type="text" spellcheck="false" @click="selectAll" />
                </div>
            </div>
        </div>

        <div class="section yellow">
            <div class="section__header">
                <h1>Misplaced Letters</h1>
                <button class="button reset" @click.prevent="resetYellow">
                    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h18.9l33.2 372.3a48 48 0 0 0 47.8 43.7h232.2a48 48 0 0 0 47.8-43.7L421.1 96H440a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zm184.8 427a15.91 15.91 0 0 1-15.9 14.6H107.9A15.91 15.91 0 0 1 92 465.4L59 96h330z"></path></svg>
                </button>
            </div>

            <div class="section__body">
                <div class="inputs chars yellow">
                    <input v-model="yellow1" class="input chars yellow" maxlength="4" type="text" name="yellow1" spellcheck="false" @click="cursorEnd" />
                    <input v-model="yellow2" class="input chars yellow" maxlength="4" type="text" name="yellow2" spellcheck="false" @click="cursorEnd" />
                    <input v-model="yellow3" class="input chars yellow" maxlength="4" type="text" name="yellow3" spellcheck="false" @click="cursorEnd" />
                    <input v-model="yellow4" class="input chars yellow" maxlength="4" type="text" name="yellow4" spellcheck="false" @click="cursorEnd" />
                    <input v-model="yellow5" class="input chars yellow" maxlength="4" type="text" name="yellow5" spellcheck="false" @click="cursorEnd" />
                </div>
            </div>
        </div>

        <div class="section gray">
            <div class="section__header">
                <h1>Invalid Letters</h1>
                <button class="button reset" @click.prevent="resetGray">
                    <svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h18.9l33.2 372.3a48 48 0 0 0 47.8 43.7h232.2a48 48 0 0 0 47.8-43.7L421.1 96H440a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zm184.8 427a15.91 15.91 0 0 1-15.9 14.6H107.9A15.91 15.91 0 0 1 92 465.4L59 96h330z"></path></svg>
                </button>
            </div>

            <div class="section__body">
                <div class="inputs line gray">
                    <input v-model="gray" class="input line gray" maxlength="26" type="text" name="grays" spellcheck="false" @click="cursorEnd" />
                </div>
            </div>
        </div>
    </form>

    <div v-if="hasInput" class="section results">
        <div class="section__body">
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
.button {
    background: var(--gray-3);
    padding: .5em 1em;
    width: auto;
    height: auto;
    border-radius: 5px;
}

.reset {
    color: var(--gray-3);
    background: none;
    border: none;
    height: 2rem;
    margin: 0;
    padding: .5em;
    cursor: pointer;

}

.reset svg {
    /* height: 20px; */
}


.section {
    /* padding: .75em .5em; */
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
    font-size: 1.2em;
    line-height: 1;
    margin: 0;
    /* margin: 0 1em .25em; */
}

.section p {
    text-align: center;
    margin: 0 1em 1em;
}

.section__header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: .75em .5em;
    border-bottom: 1px solid var(--gray-3);
}

.section__body {
    padding: .75em .5em;
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
    font-size: 1.1em;
    color: var(--tile-text-color);
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    border: none;
    transition: all 100ms;
}

.input:focus {
    /* font-size: 1.4em; */
    transform: scale(1.2);
}

.input.line:focus {
    width: 80%;
}

@media screen and (min-width: 25em) {
    .input {
        font-size: 1.4em;
    }
}

@media screen and (min-width: 30em) {
    .input {
        font-size: 1.7em;
    }
}

.input + .input {
    margin-left: .5em;
}

.input.char {
    /* width: 1.5em; */
}

.input.chars {
    resize: none;
    /* height: 3em; */
    vertical-align: middle;
    /* width: 3em; */
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

.buttons {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    margin-bottom: 1em;
}

.result-count {
    font-size: 1.2;
    height: 2em;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin-bottom: .5em;
}

.result-count p {
    margin: 0;
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
