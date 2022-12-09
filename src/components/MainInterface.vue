<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { Guess } from '@/guess';
import { encodeShareCode, decodeShareCode } from '@/encoding';
import type { ShareData } from '@/encoding';
import { savePuzzle, loadPuzzleByDate, loadPuzzleByAnswer } from '@/settings';
import { dateIndex } from '@/game';

import PuzzleInput from './PuzzleInput.vue';
import SummaryView from './SummaryView.vue';
import AnswerPicker from './AnswerPicker.vue';

import IconTrashCanUndo from './icons/IconTrashCanUndo.vue';

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
    return page.screenWidth < 70*16;
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

//
// Handle inputs and show summary
//

const guesses = ref<Guess[]>([]);
const puzzleAnswer = ref<string | undefined>();
const puzzleDate = ref<Date | undefined>();
const selectedGuess = ref<Guess | undefined>();
let loading = true;

const lastGuess = computed(() => {
    if (guesses.value.length > 0) {
        return guesses.value[guesses.value.length - 1];
    } else {
        return undefined;
    }
});


const completed = computed(() => {
    return lastGuess.value != undefined && lastGuess.value.isComplete;
});

const shareCode = computed(() => {
    if (completed.value) {
        const words = guesses.value.map(value => value.word);
        if (puzzleDate.value) {
            return encodeShareCode(words, puzzleDate.value);
        } else if (puzzleAnswer.value) {
            return encodeShareCode(words, puzzleAnswer.value);
        } else {
            return "";
        }
    } else {
        return "";
    }
});

const shareURL = computed(() => {
    const url = new URL(window.location.href);
    url.hash = shareCode.value;
    return url.toString();
});

function appendGuess(guess: Guess) {
    guesses.value = [...guesses.value, guess];

    // Save the share code in localStorage whenever the puzzle is completed
    if (!loading && shareCode.value) {
        const key = savePuzzle(guesses.value, puzzleDate.value, puzzleAnswer.value);
        if (key) {
            console.debug(`Saved puzzle to localStorage with key ${key}`);
        }
    }
}

function appendWord(word: string) {
    if (puzzleAnswer.value) {
        const guessIndex = guesses.value.length;
        const previous = guessIndex > 0 ? guesses.value[guessIndex - 1] : undefined;
        const guess = new Guess(word, guessIndex, puzzleAnswer.value, previous);
        appendGuess(guess);
    } else {
        throw "Cannot add Guesses if no puzzle answer is set";
    }
}

function removeGuess(index: number) {
    // Remove the given guess index and all that follow
    guesses.value = guesses.value.slice(0, index);
}

function resetGuesses() {
    removeGuess(0);
}

// Select the last guess whenever the list changes, such as a new one is added
watch(guesses, (newGuesses, oldGuesses) => {
    selectedGuess.value = newGuesses[newGuesses.length-1];
});

function guessClicked(guess?: Guess) {
    selectedGuess.value = guess;
    showSummaryPage();
}

// Load answer, date, guesses in share-code
function loadFromShareCode(shareCode: string): boolean {
    loading = true;
    nextTick(() => { loading = false; });

    let shareData: ShareData | undefined;
    try {
        shareData = decodeShareCode(shareCode);
    } catch(e) {
        console.error("Invalid shareCode", shareCode, e);
        return false;
    }

    console.log("Decoded share code", shareCode, shareData);

    // Remove existing guesses
    resetGuesses();

    // ShareData should always contain an answer
    if (shareData.answer) {
        puzzleAnswer.value = shareData.answer
    } else {
        throw new Error("Cannot decode answer from share code");
    }

    // The ShareData may contain a date
    if (shareData.date) {
        puzzleDate.value = shareData.date;
    }

    // Add all of the words as guesses
    for (let word of shareData.words) {
        appendWord(word);
    }

    return true;
}

function loadFromWindowLocation(): boolean {
    if (window.location.hash != "") {
        let shareCode = window.location.hash;
        if (shareCode.slice(0, 1) == "#") {
            shareCode = shareCode.slice(1);
        }
        console.log("Found share code in hash", shareCode);

        return loadFromShareCode(shareCode);
    }
    
    return false;
}

function loadPuzzleFromStorage(): boolean {
    loading = true;
    nextTick(() => { loading = false; });
    
    if (puzzleDate.value) {
        const puzzleState = loadPuzzleByDate(puzzleDate.value);
        if (puzzleState) {
            console.log("Loading share code", puzzleState.shareCode, "for date", puzzleDate.value);
            return loadFromShareCode(puzzleState.shareCode);
        } else {
            resetGuesses();
            console.log("No share code found for date", puzzleDate.value, dateIndex(puzzleDate.value));
            return false;
        }
    } else if (puzzleAnswer.value) {
        const puzzleState = loadPuzzleByAnswer(puzzleAnswer.value);
        if (puzzleState) {
            console.log("Loading share code", puzzleState.shareCode, "for answer", puzzleAnswer.value);
            return loadFromShareCode(puzzleState.shareCode);
        } else {
            resetGuesses();
            console.log("No share code found for answer", puzzleAnswer.value);
            return false;
        }
    } else {
        console.log("No puzzle answer or date set, resetting guesses");
        resetGuesses();
        return false;
    }
}

// If there is a hash in the URL, try to load it as a share code, otherwise try to load from localStorage
onBeforeMount(() => {
    let loaded = false;

    // Try loading from a hash in the URL
    loaded = loadFromWindowLocation();

    // If that didn't work, set the puzzleDate to today and try loading from localStorage
    // NOTE: We don't set the puzzleAnswer, as that will be done by AnswerPicker
    if (!loaded) {
        puzzleDate.value = new Date();
        loaded = loadPuzzleFromStorage();
    }

    // If that didn't work, reset the guesses
    if (!loaded) {
        resetGuesses();
    }
});

// Update the URL bar when the shareURL changes
watch(shareURL, (newShareURL, oldShareURL) => {
    // if (loading) return;
    if (newShareURL !== window.location.toString()) {
        console.log(`replaceState ${window.location} -> ${newShareURL}`);
        history.replaceState(null, "", newShareURL);
    }
})

// Detect if the URL hash changes and attempt to load it as a share code
window.addEventListener("popstate", (e) => {
    console.log("popstate", window.location);
    loadFromWindowLocation();
});

// When the user interacts with the AnswerPicker, attempt to load the list of guesses from local storage,
// or else just reset the list
function answerPickerUpdated(answer: string, date?: Date) {
    console.log("AnswerPicker updated", answer, date)
    puzzleAnswer.value = answer;
    puzzleDate.value = date;
    if (!loading) {
        loadPuzzleFromStorage();
    }
}

// watch(puzzleDate, (newPuzzleDate, oldPuzzleDate) => {
//     console.log(`puzzleDate changed ${oldPuzzleDate} -> ${newPuzzleDate} puzzleAnswer: ${puzzleAnswer.value}`);
// });

// watch(puzzleAnswer, (newPuzzleAnswer, oldPuzzleAnswer) => {
//     console.log(`puzzleAnswer changed ${oldPuzzleAnswer} -> ${newPuzzleAnswer} puzzleDate: ${puzzleDate.value}`);
// });

// Change title when the puzzleDate or puzzleAnswer change
const title = computed(() => {
    if (puzzleDate.value != null) {
        return `${puzzleDate.value.toLocaleDateString()} - ${dateIndex(puzzleDate.value!)} - Gradle`;
    } else if (puzzleAnswer.value) {
        return `${puzzleAnswer.value.toUpperCase()} - Gradle`;
    } else {
        return "Gradle";
    }
});

watch(title, (newTitle) => {
    document.title = newTitle;
});

// Debug stuff
const puzzleDebug = ref(false);

onMounted(() => {
    window.addEventListener('keyup', (e) => {
        if (e.key == "?") {
            puzzleDebug.value = !puzzleDebug.value;
        }
    })
});

</script>

<template>
    <div v-if="page.dragDebug && dragEnabled" class="drag-debug">
        {{ page.screenWidth }} {{ page.current }} {{ page.dragging }}
        {{ page.dragStart.toFixed(2) }} {{ page.dragCurrent.toFixed(2) }} {{ dragOffset.toFixed(2) }} {{
        dragOffsetPercent.toFixed(2) }}
        {{ page.dragVelocity.toFixed(2) }}
    </div>

    <main class="main-interface" @keyup.esc="showInputPage" @pointerdown="startDrag" @pointermove="updateDrag"
        @pointerup="endDrag" @pointercancel="endDrag" @pointerleave="endDrag">
        <div class="page input-page" :class="{ show: isInputPage }"
            :style="{ transform: inputPageTransform, transition: dragTransition }">
            <div class="tools">
                <AnswerPicker :date="puzzleDate" :answer="puzzleAnswer" @updated="answerPickerUpdated" />
                <button class="button icon px-3" @click.stop="resetGuesses" title="Reset">
                    <IconTrashCanUndo />
                </button>
            </div>

            <div v-if="puzzleDebug" class="puzzle-debug">
                puzzleAnswer: {{ puzzleAnswer }}<br />
                puzzleDate: {{ puzzleDate }}<br />
            </div>

            <PuzzleInput v-if="puzzleAnswer" :guesses="guesses" :selectedGuess="selectedGuess" :puzzleAnswer="puzzleAnswer || ''"
                :puzzleDate="puzzleDate" @appendGuess="appendGuess" @removeGuess="removeGuess"
                @guessClicked="guessClicked" :shareCode="shareCode" :shareURL="shareURL" />
        </div>

        <div class="page summary-page" :class="{ show: isSummaryPage }"
            :style="{ transform: summaryPageTransform, transition: dragTransition }">
            <SummaryView :guess="selectedGuess" @backClicked="showInputPage" />
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

    .puzzle-debug {
        background: var(--gray-5);
        padding: .5em;
        margin-bottom: 1em;
    }

    .tools {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1em;
    }
    
    .answer-picker {
        /* margin-bottom: 1em; */
        flex: 1;
    }

    /* Small screens only */
    @media screen and (max-width: 69.9375em) {
        .main-interface {
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
    @media screen and (min-width: 70em) {
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
