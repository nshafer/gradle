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
            page: "input",
            debug: false,
            benchmark: true,
            benchmarkResults: {},

            green1: "", green2: "", green3: "", green4: "", green5: "",
            yellow1: "", yellow2: "", yellow3: "", yellow4: "", yellow5: "",
            gray: "",
        }
    },
    computed: {
        isInputPage() {
            return this.page == "input";
        },
        isResultPage() {
            return this.page == "result";
        },
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
        showInputPage() {
            this.page = "input";
        },
        showResultPage() {
            this.page = "result";
        },
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
    <main class="helper" @keydown.esc="showInputPage">
        <div class="input-page" :class="{ show: isInputPage }">
            <div v-if="hasInput" class="page-header double">
                <p>
                    <b>{{ results.length }}</b> possible answers.
                </p>
                <button class="button with-icon-right" @click.prevent="showResultPage">
                    Results
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z"/></svg>
                </button>
            </div>
            <div v-else class="page-header single">
                <p>
                    Enter the letters from your puzzle
                </p>
            </div>

            <form @submit.prevent="showResultPage">
                <button hidden type="submit" @click.prevent="showResultPage">Submit</button>
                <div class="section green">
                    <div class="section__header">
                        <h1>Correct Letters</h1>
                        <button class="button icon" @click.prevent="resetGreen">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h18.9l33.2 372.3a48 48 0 0 0 47.8 43.7h232.2a48 48 0 0 0 47.8-43.7L421.1 96H440a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zm184.8 427a15.91 15.91 0 0 1-15.9 14.6H107.9A15.91 15.91 0 0 1 92 465.4L59 96h330z"></path></svg>
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
                        <button class="button icon" @click.prevent="resetYellow">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h18.9l33.2 372.3a48 48 0 0 0 47.8 43.7h232.2a48 48 0 0 0 47.8-43.7L421.1 96H440a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zm184.8 427a15.91 15.91 0 0 1-15.9 14.6H107.9A15.91 15.91 0 0 1 92 465.4L59 96h330z"></path></svg>
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
                        <button class="button icon" @click.prevent="resetGray">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M440 64H336l-33.6-44.8A48 48 0 0 0 264 0h-80a48 48 0 0 0-38.4 19.2L112 64H8a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h18.9l33.2 372.3a48 48 0 0 0 47.8 43.7h232.2a48 48 0 0 0 47.8-43.7L421.1 96H440a8 8 0 0 0 8-8V72a8 8 0 0 0-8-8zM171.2 38.4A16.1 16.1 0 0 1 184 32h80a16.1 16.1 0 0 1 12.8 6.4L296 64H152zm184.8 427a15.91 15.91 0 0 1-15.9 14.6H107.9A15.91 15.91 0 0 1 92 465.4L59 96h330z"></path></svg>
                        </button>
                    </div>

                    <div class="section__body">
                        <div class="inputs line gray">
                            <input v-model="gray" class="input line gray" maxlength="26" type="text" name="grays" spellcheck="false" @click="cursorEnd" />
                        </div>
                    </div>
                </div>
            </form>

            <div v-if="debug" class="debug">
                Greens: {{ greens }}<br/>
                Yellows: {{ yellows }}<br/>
                Grays: {{ grays }}<br/>
            </div>

            <div v-if="benchmark">
                Solve: {{ parseFloat(benchmarkResults["solve"]).toFixed(1) }} ms
            </div>
        </div>

        <div class="result-page" :class="{ show: isResultPage }">
            <div v-if="hasInput" class="page-header double">
                <button class="button with-icon-left" @click.prevent="showInputPage">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M203.9 405.3c5.877 6.594 5.361 16.69-1.188 22.62c-6.562 5.906-16.69 5.375-22.59-1.188L36.1 266.7c-5.469-6.125-5.469-15.31 0-21.44l144-159.1c5.906-6.562 16.03-7.094 22.59-1.188c6.918 6.271 6.783 16.39 1.188 22.62L69.53 256L203.9 405.3z"/></svg>
                    Back
                </button>
                <p>
                    <b>{{ results.length }}</b> possible answers.
                </p>
            </div>
            <div v-else class="page-header double">
                <button class="button" @click.prevent="showInputPage">&lt;-</button>
                <p>
                    Enter the letters from your puzzle
                </p>
            </div>

            <div v-if="hasInput" class="section results">
                <div class="section__body">
                    <div v-if="results.length > 1000">
                        <h2>There are <strong>over 1000</strong> possible answers!</h2>

                        <p>Here is a random possible word to try next.</p>

                        <ul class="wordlist">
                            <li class="word">{{ randomResult }}</li>
                        </ul>
                    </div>
                    <div v-else-if="results.length > 9">
                        <h2>There are <strong>{{ results.length }}</strong> possible answers!</h2>

                        <p>Here is a random possible word to try next.</p>

                        <ul class="wordlist">
                            <li class="word">{{ randomResult }}</li>
                        </ul>
                    </div>
                    <div v-else-if="results.length > 1">
                        <h2>There are only {{ results.length }} possible answers.</h2>

                        <p>It has to be one of these:</p>
                        
                        <ul class="wordlist">
                            <li v-for="word in results" :key="word" class="word">
                                {{ word }}
                            </li>
                        </ul>
                    </div>
                    <div v-else-if="results.length == 1">
                        <h2>There is only one possible answer:</h2>

                        <ul class="wordlist">
                            <li class="word correct">{{ results[0] }}</li>
                        </ul>
                    </div>
                    <div v-else>
                        <p>No results found. Please check your input and try again!</p>
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

        </div>
    </main>
</template>

<style scoped>
/* .helper {
} */

.input-page {
    padding: .5em;
}

.result-page {
    padding: .5em;
}

.page-header {
    font-size: 1.2;
    height: 2em;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin-bottom: .5em;
}

.page-header p {
    margin: 0;
}

/* Small screens only */
@media screen and (max-width: 59.9375em) {
    .helper {
        position: relative;
        width: 100%;
        overflow-x: hidden;
        /* overflow-y: visible; */
        /* height: calc(90%); */
    }

    .input-page {
        position: absolute;
        transform: translateX(-100%);
        transition: all 100ms;
        width: 100%;
    }

    .input-page.show {
        transform: translateX(0);
    }

    .result-page {
        position: absolute;
        transform: translateX(100%);
        transition: all 100ms;
        width: 100%;
    }

    .result-page.show {
        transform: translateX(0);
    }

    .page-header.double {
        justify-content: space-between;
    }
}

/* Large screens only */
@media screen and (min-width: 60em) {
    .helper {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .input-page {
        padding: 1em;
    }

    .page-header {
        display: none;
    }

    .result-page {
        padding: 1em;
    }

    .result-page .page-header .button {
        display: none;
    }
}

.section {
    /* padding: .75em .5em; */
    margin-bottom: 1em;
    background: var(--gray-5);
    border: 1px solid transparent;
}

.section h1 {
    text-align: center;
    font-size: 1.2em;
    line-height: 1;
    margin: 0;
    /* margin: 0 1em .25em; */
}

.section h2 {
    font-size: 1.1em;
    margin: 0 0 .25em;
}

.section p {
    margin: 0 0 1em;
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
    background: var(--input-bg);
    width: 100%;
    height: 1.5em;
    font-size: 1.1em;
    color: var(--input-text-color);
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
    width: 1.5em;
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
}

.input.yellow {
    background: var(--color-present);
}

.input.gray {
    background: var(--color-absent);
}

.results {
    text-align: center;
}

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

footer {
    margin-top: auto;
}

</style>
