<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';

import type { GreensArray, YellowsArray, GraysArray } from '@/solver';
import Solver from '../solver';
import PuzzleInput from './PuzzleInput.vue';
import ResultsView from './ResultsView.vue';
import IconAngleLeft from './icons/IconAngleLeft.vue';
import IconAngleRight from './icons/IconAngleRight.vue';

function getScreenWidth(): number {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

const hasInput = ref(false);
const solver = ref<Solver | null>(null);
const answers = ref<string[]>([]);

function updateAnswers(input: boolean, greens: GreensArray, yellows: YellowsArray, grays: GraysArray) {
    hasInput.value = input;
    if (hasInput) {
        console.time("solve");
        solver.value = new Solver(greens, yellows, grays);
        answers.value = solver.value.solve();
        console.timeEnd("solve");
    } else {
        answers.value = [];
    }
}

// Page/dragging support
const page = reactive({
    current: "input",
    screenWidth: getScreenWidth(),
    dragging: false,
    dragDebug: false,
    dragStart: 0,
    dragCurrent: 0,
    dragVelocity: 0,
});

function updateWindowWidth() {
    page.screenWidth = getScreenWidth();
};

onMounted(() => {
    window.addEventListener("resize", updateWindowWidth);
});

onUnmounted(() => {
    window.removeEventListener("resize", updateWindowWidth);
});

const isInputPage = computed(() => {
    return page.current === "input";
});

const isResultPage = computed(() => {
    return page.current === "result";
});

function showInputPage() {
    page.current = "input";
}

function showResultPage() {
    page.current = "result";
}

const dragEnabled = computed(() => {
    return page.screenWidth < 960;
});

const dragOffset = computed(() => {
    if (page.dragging) {
        return page.dragCurrent - page.dragStart
    } else {
        return 0;
    }
})

const dragOffsetPercent = computed(() => {
    return (dragOffset.value / page.screenWidth) * 100;
})

const dragTransition = computed(() => {
    if (page.dragging) {
        return "none";
    } else {
        return "all 200ms";
    }
})

const inputPageTransform = computed(() => {
    if (dragEnabled.value) {
        if (page.dragging && Math.abs(dragOffset.value) > 10) {
            if (page.current == "input") {
                if (dragOffset.value > 0) {
                    return `translateX(${Math.log(dragOffsetPercent.value)}%)`;
                } else {
                    return `translateX(${dragOffsetPercent.value}%)`;
                }
            } else {
                return `translateX(${dragOffsetPercent.value - 100}%)`;
            }
        } else {
            if (page.current == "input") {
                return "translateX(0%)"
            } else {
                return "translateX(-100%)"
            }
        }
    } else {
        return "";
    }
});

const resultPageTransform = computed(() => {
    if (dragEnabled.value) {
        if (page.dragging && Math.abs(dragOffset.value) > 10) {
            if (page.current == "result") {
                if (dragOffset.value < 0) {
                    return `translateX(-${Math.log(-dragOffsetPercent.value)}%)`;
                } else {
                    return `translateX(${dragOffsetPercent.value}%)`;
                }
            } else {
                return `translateX(${100 + dragOffsetPercent.value}%)`;
            }
        } else {
            if (page.current == "result") {
                return "translateX(0%)"
            } else {
                return "translateX(100%)"
            }
        }
    } else {
        return "";
    }
});

function startDrag(event: PointerEvent) {
    updateWindowWidth();
    if (dragEnabled.value) {
        // console.log("startDrag", event);
        page.dragging = true;
        page.dragStart = page.dragCurrent = event.x;
    }
}

function updateDrag(event: PointerEvent) {
    if (dragEnabled.value && page.dragging) {
        // console.log("updateDrag", event);
        const dragLast = page.dragCurrent;
        page.dragCurrent = event.x;
        page.dragVelocity = page.dragCurrent - dragLast;
        // console.log("dragVelocity", page.dragVelocity);
    }
}

function endDrag(event: PointerEvent) {
    if (dragEnabled.value) {
        // console.log("endDrag", event, this.dragVelocity);
        if (page.current == "input" && (dragOffsetPercent.value < -50 || (Math.abs(dragOffsetPercent.value) > 10 && page.dragVelocity < -2))) {
            showResultPage();
        } else if (page.current == "result" && (dragOffsetPercent.value > 50 || (Math.abs(dragOffsetPercent.value) > 10 && page.dragVelocity > 2))) {
            showInputPage();
        }
        page.dragging = false;
        page.dragVelocity = 0;
    }
}

</script>

<template>
    <div v-if="page.dragDebug && dragEnabled" class="drag-debug">
        {{ page.screenWidth }} {{ page.current }} {{ page.dragging }}
        {{ page.dragStart.toFixed(2) }} {{ page.dragCurrent.toFixed(2) }} {{ dragOffset.toFixed(2) }} {{ dragOffsetPercent.toFixed(2) }}
        {{ page.dragVelocity.toFixed(2) }}
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
                    <IconAngleRight />
                </button>
            </div>
        </div>

        <div class="page result-page" :class="{ show: isResultPage }" :style="{ transform: resultPageTransform, transition: dragTransition }">
            <div class="page-body">
                <ResultsView :hasInput="hasInput" :solver="solver" :answers="answers" />
            </div>

            <div class="page-nav double">
                <button class="button with-icon-left" @click.prevent="showInputPage">
                    <IconAngleLeft />
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
