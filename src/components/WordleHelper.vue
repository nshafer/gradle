<script lang="ts">
import { defineComponent } from 'vue';

import type { GreensArray, YellowsArray, GraysArray } from '@/solver';
import Solver from '../solver';
import PuzzleInput from './PuzzleInput.vue';
import ResultsView from './ResultsView.vue';

interface Benchmark {
    [name: string]: number
}

const benchmarks: Benchmark = {};

function getScreenWidth(): number {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

export default defineComponent({
    name: "WordleHelper",
    components: {
        PuzzleInput,
        ResultsView,
    },
    data() {
        return {
            currentPage: "input",
            hasInput: false,
            solver: null as Solver | null,
            answers: [] as string[],
            benchmark: false,
            benchmarkResults: {} as Benchmark,
            screenWidth: getScreenWidth(),
            dragging: false,
            dragDebug: false,
            dragStart: 0,
            dragCurrent: 0,
            dragVelocity: 0,
        }
    },
    mounted() {
        window.addEventListener("resize", this.updateWindowWidth);
    },
    unmounted() {
        window.removeEventListener("resize", this.updateWindowWidth);
    },
    computed: {
        isInputPage(): boolean {
            return this.currentPage === "input";
        },
        isResultPage(): boolean {
            return this.currentPage === "result";
        },
        dragEnabled(): boolean {
            return this.screenWidth < 960;
        },
        dragOffset(): number {
            if (this.dragging) {
                return this.dragCurrent - this.dragStart
            } else {
                return 0;
            }
        },
        dragOffsetPercent(): number {
            return (this.dragOffset / this.screenWidth) * 100;
        },
        dragTransition(): string {
            if (this.dragging) {
                return "none";
            } else {
                return "all 200ms";
            }
        },
        inputPageTransform(): string {
            if (this.dragEnabled) {
                if (this.dragging && Math.abs(this.dragOffset) > 10) {
                    if (this.currentPage == "input") {
                        if (this.dragOffset > 0) {
                            return `translateX(${Math.log(this.dragOffsetPercent)}%)`;
                        } else {
                            return `translateX(${this.dragOffsetPercent}%)`;
                        }
                    } else {
                        return `translateX(${this.dragOffsetPercent - 100}%)`;
                    }
                } else {
                    if (this.currentPage == "input") {
                        return "translateX(0%)"
                    } else {
                        return "translateX(-100%)"
                    }
                }
            } else {
                return "";
            }
        },
        resultPageTransform(): string {
            if (this.dragEnabled) {
                if (this.dragging && Math.abs(this.dragOffset) > 10) {
                    // let dragPercent = Number(this.dragOffsetPercent);
                    // if (dragPercent > 0) {
                    //     dragPercent = Math.log(dragPercent);
                    // }
                    if (this.currentPage == "result") {
                        if (this.dragOffset < 0) {
                            return `translateX(-${Math.log(-this.dragOffsetPercent)}%)`;
                        } else {
                            return `translateX(${this.dragOffsetPercent}%)`;
                        }
                    } else {
                        return `translateX(${100 + this.dragOffsetPercent}%)`;
                    }
                } else {
                    if (this.currentPage == "result") {
                        return "translateX(0%)"
                    } else {
                        return "translateX(100%)"
                    }
                }
            } else {
                return "";
            }
        },
    },
    methods: {
        showInputPage() {
            this.currentPage = "input";
        },
        showResultPage() {
            this.currentPage = "result";
        },
        updateAnswers(hasInput: boolean, greens: GreensArray, yellows: YellowsArray, grays: GraysArray) {
            this.hasInput = hasInput;
            if (hasInput) {
                this.benchmarkStart("solve");
                console.time("solve");
                this.solver = new Solver(greens, yellows, grays);
                this.answers = this.solver.solve();
                this.benchmarkEnd("solve");
                console.timeEnd("solve");
            } else {
                this.answers = [];
            }
        },
        benchmarkStart(name: string) {
            benchmarks[name] = window.performance.now();
        },
        benchmarkEnd(name: string) {
            const end = window.performance.now();
            if (benchmarks[name]) {
                const res = end - benchmarks[name];
                this.benchmarkResults[name] = res;
            }
        },
        benchmarkResult(name: string): string {
            if (this.benchmarkResults[name]) {
                return this.benchmarkResults[name].toFixed(1);
            } else {
                return "-"
            }
        },
        updateWindowWidth() {
            this.screenWidth = getScreenWidth();
        },
        startDrag(event: PointerEvent) {
            this.updateWindowWidth();
            if (this.dragEnabled) {
                // console.log("startDrag", event);
                this.dragging = true;
                this.dragStart = this.dragCurrent = event.x;
            }
        },
        updateDrag(event: PointerEvent) {
            if (this.dragEnabled && this.dragging) {
                // console.log("updateDrag", event);
                const dragLast = this.dragCurrent;
                this.dragCurrent = event.x;
                this.dragVelocity = this.dragCurrent - dragLast;
                // console.log("dragVelocity", this.dragVelocity);
            }
        },
        endDrag(event: PointerEvent) {
            if (this.dragEnabled) {
                // console.log("endDrag", event, this.dragVelocity);
                if (this.currentPage == "input" && (this.dragOffsetPercent < -50 || (Math.abs(this.dragOffsetPercent) > 10 && this.dragVelocity < -2))) {
                    this.showResultPage();
                } else if (this.currentPage == "result" && (this.dragOffsetPercent > 50 || (Math.abs(this.dragOffsetPercent) > 10 && this.dragVelocity > 2))) {
                    this.showInputPage();
                }
                this.dragging = false;
                this.dragVelocity = 0;
            }
        },
    },
});
</script>

<template>
    <div v-if="dragDebug && dragEnabled" class="drag-debug">
        {{ screenWidth }} {{ currentPage }} {{ dragging }}
        {{ dragStart.toFixed(2) }} {{ dragCurrent.toFixed(2) }} {{ dragOffset.toFixed(2) }} {{ dragOffsetPercent.toFixed(2) }}
        {{ dragVelocity.toFixed(2) }}
    </div>

    <div v-if="benchmark" class="benchmark">
        Solve: {{ benchmarkResult("solve") }} ms
    </div>

    <main class="helper" @keydown.esc="showInputPage" @pointerdown="startDrag" @pointermove="updateDrag" @pointerup="endDrag" @pointercancel="endDrag" @pointerleave="endDrag">
        <div class="page input-page" :class="{ show: isInputPage }" :style="{ transform: inputPageTransform, transition: dragTransition }">
            <div class="page-body">
                <PuzzleInput @inputChanged="updateAnswers" @inputDone="showResultPage"/>
            </div>

            <div class="page-nav double">
                <p v-if="hasInput">
                    <b>{{ answers.length }}</b> possible answer<template v-if="answers.length != 1">s</template>
                </p>
                <p v-else class="text-muted">
                    <b>{{ answers.length }}</b> possible answer<template v-if="answers.length != 1">s</template>
                </p>

                <button class="button with-icon-right" @click.prevent="showResultPage">
                    Results
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z"/></svg>
                </button>
            </div>
        </div>

        <div class="page result-page" :class="{ show: isResultPage }" :style="{ transform: resultPageTransform, transition: dragTransition }">
            <div class="page-body">
                <ResultsView :hasInput="hasInput" :solver="solver" :answers="answers" />
            </div>

            <div class="page-nav double">
                <button class="button with-icon-left" @click.prevent="showInputPage">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M203.9 405.3c5.877 6.594 5.361 16.69-1.188 22.62c-6.562 5.906-16.69 5.375-22.59-1.188L36.1 266.7c-5.469-6.125-5.469-15.31 0-21.44l144-159.1c5.906-6.562 16.03-7.094 22.59-1.188c6.918 6.271 6.783 16.39 1.188 22.62L69.53 256L203.9 405.3z"/></svg>
                    Back
                </button>
                <p v-if="hasInput">
                    <b>{{ answers.length }}</b> possible answer<template v-if="answers.length != 1">s</template>
                </p>
                <p v-else class="text-muted">
                    <b>{{ answers.length }}</b> possible answer<template v-if="answers.length != 1">s</template>
                </p>
            </div>
        </div>
    </main>
</template>

<style scoped>
.page {
    display: flex;
    flex-flow: column nowrap;
}

.page-nav {
    font-size: 1.2em;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin-top: .5em;
    padding: .5em;
    border-top: 2px solid var(--gray-4);
}

.page-nav p {
    margin: 0;
}

.page-body {
    height: 100%;
    padding: .5em;
    overflow-x: hidden;
    overflow-y: auto;
}

.benchmark {
    position: fixed;
    top: 0;
    right: 5em;
    padding: .25em;
    background: var(--color-background);
}

.drag-debug {
    position: fixed;
    top: 0;
    left: 3em;
    padding: .25em;
    background: var(--color-background);
}

/* Small screens only */
@media screen and (max-width: 59.9375em) {
    .helper {
        position: relative;
        width: 100%;
        user-select: none;
    }

    .page {
        position: fixed;
        width: 100%;
        top: var(--header-height);
        bottom: 0;
    }

    .page-body {
        touch-action: pan-y;
    }

    .page-nav.double {
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
        padding: .5em .5em 1em 1em;
    }

    .page-nav {
        display: none;
    }

    .result-page {
        padding: .5em 1em 1em .5em;
    }

    .result-page .page-nav .button {
        display: none;
    }
}

@media screen and (min-width: 81em) {
    .helper {
        gap: 1em
    }

    .input-page {
        padding: 1em 0;
    }

    .page-nav {
        display: none;
    }

    .result-page {
        padding: 1em 0;
    }
}

</style>
