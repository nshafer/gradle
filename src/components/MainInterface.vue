<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';

import type { GreensArray, YellowsArray, GraysArray } from '@/solver';
import Solver from '../solver';
import PuzzleInput from './PuzzleInput.vue';
import SummaryView from './SummaryView.vue';
import IconAngleLeft from './icons/IconAngleLeft.vue';
import IconAngleRight from './icons/IconAngleRight.vue';
import type { Guess } from '@/guess';

// Page/dragging support
function getScreenWidth(): number {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

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

const isSummaryPage = computed(() => {
    return page.current === "summary";
});

function showInputPage() {
    page.current = "input";
}

function showSummaryPage() {
    page.current = "summary";
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

const summaryPageTransform = computed(() => {
    if (dragEnabled.value) {
        if (page.dragging && Math.abs(dragOffset.value) > 10) {
            if (page.current == "summary") {
                if (dragOffset.value < 0) {
                    return `translateX(-${Math.log(-dragOffsetPercent.value)}%)`;
                } else {
                    return `translateX(${dragOffsetPercent.value}%)`;
                }
            } else {
                return `translateX(${100 + dragOffsetPercent.value}%)`;
            }
        } else {
            if (page.current == "summary") {
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
            showSummaryPage();
        } else if (page.current == "summary" && (dragOffsetPercent.value > 50 || (Math.abs(dragOffsetPercent.value) > 10 && page.dragVelocity > 2))) {
            showInputPage();
        }
        page.dragging = false;
        page.dragVelocity = 0;
    }
}

// Handle inputs and show summary
const guesses = ref<Guess[]>([]);
const selectedGuess = ref<Guess | undefined>(undefined);

watch(guesses, (newGuesses, oldGuesses) => {
    // console.log("guesses updated", oldGuesses, newGuesses);
    selectedGuess.value = newGuesses[newGuesses.length-1];
    // console.log("selectedGuess now", selectedGuess.value);
});

function guessClicked(guess?: Guess) {
    console.log("MainInterface.guessClicked", guess)
    selectedGuess.value = guess;
    showSummaryPage();
}
</script>

<template>
    <div v-if="page.dragDebug && dragEnabled" class="drag-debug">
        {{ page.screenWidth }} {{ page.current }} {{ page.dragging }}
        {{ page.dragStart.toFixed(2) }} {{ page.dragCurrent.toFixed(2) }} {{ dragOffset.toFixed(2) }} {{ dragOffsetPercent.toFixed(2) }}
        {{ page.dragVelocity.toFixed(2) }}
    </div>

    <main class="main-interface" @keyup.esc="showInputPage" @pointerdown="startDrag" @pointermove="updateDrag" @pointerup="endDrag" @pointercancel="endDrag" @pointerleave="endDrag">
        <div class="page input-page" :class="{ show: isInputPage }" :style="{ transform: inputPageTransform, transition: dragTransition }">
            <PuzzleInput v-model="guesses" :selectedGuess="selectedGuess" @guessClicked="guessClicked"/>
        </div>

        <div class="page summary-page" :class="{ show: isSummaryPage }" :style="{ transform: summaryPageTransform, transition: dragTransition }">
            <SummaryView :guess="selectedGuess" @backClicked="showInputPage"/>
        </div>

    </main>
</template>

<style scoped>
    .page {
        overflow-x: hidden;
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
        .main-interface {
            position: relative;
            width: 100%;
            user-select: none;
        }

        .page {
            position: fixed;
            width: 100%;
            top: calc(var(--header-height) + .5em);
            bottom: 0;
            touch-action: pan-y;
            padding: .5em;
        }

        .page-nav.double {
            justify-content: space-between;
        }
    }

    /* Large screens only */
    @media screen and (min-width: 60em) {
        .main-interface {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 100%;
        }

        .page {
            padding: 1em;
        }
    }
</style>
