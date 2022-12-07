<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getDateByDayOffset, getWordByDayOffset, letterGrade, letterGradeSimple } from '@/game';
import { loadPuzzleByDate } from '@/settings';

import Modal from './Modal.vue';

const props = defineProps(['visible']);
defineEmits(['close']);

// Get the word for the days
let today = new Date();

watch(() => props.visible, (newValue) => {
    // Update today whenever this modal becomes visible
    if (newValue) {
        today = new Date();
    }
})

// Determine if we should show today or not
let showToday = ref(false);
watch(() => props.visible, (newValue) => {
    if (newValue) {
        const puzzleState = loadPuzzleByDate(today);
        showToday.value = puzzleState != null;
    }
});

// Control how many to show
const numWords = ref(0);

function showMore() {
    numWords.value += 10;
}

// Reset to 10 whenever this becomes visible again
watch(() => props.visible, (newValue) => {
    if (newValue) {
        numWords.value = 10;
    } else {
        numWords.value = 0;
    }
});

interface Day {
    offset: number,
    dateStr: string,
    dateStrShort: string,
    dateWeekDay: string,
    word: string,
    shareCode: string | undefined,
    shareURL: string | undefined,
    finalGrade: string | undefined,
    finalLetterGrade: string | undefined,
    finalLetterGradeSimple: string | undefined,
}

// Gather together the data for each day
const days = computed(() => {
    const days = [];
    for (let i = 0; i < numWords.value; i++) {
        if (i == 0 && !showToday.value) {
            continue;
        }

        // Get the word for the day
        const offset = i * -1;
        const date = getDateByDayOffset(offset, today);
        const day: Day = {
            offset: offset,
            dateStr: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            dateStrShort: date.toLocaleDateString("en-US"),
            dateWeekDay: date.toLocaleDateString('en-US', { weekday: 'long' }),
            word: getWordByDayOffset(offset, today),
            shareCode: undefined,
            shareURL: undefined,
            finalGrade: undefined,
            finalLetterGrade: undefined,
            finalLetterGradeSimple: undefined,
        }
        
        // Attempt to load saved puzzle state for that day
        const puzzleState = loadPuzzleByDate(date);
        if (puzzleState) {
            const shareURL = new URL(window.location.href);
            shareURL.hash = puzzleState.shareCode;
            Object.assign(day, {
                shareCode: puzzleState.shareCode,
                shareURL: shareURL,
                finalGrade: puzzleState.finalGrade,
                finalLetterGrade: letterGrade(puzzleState?.finalGrade),
                finalLetterGradeSimple: letterGradeSimple(puzzleState?.finalGrade),
            });
        }

        days.push(day);
    }
    return days;
});

</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" title="Answer History">
        <template #body>
            <div class="mb-3">
                <table class="table">
                    <tbody>
                        <tr v-for="day in days" :key="day.offset">
                            <td class="date-cell">
                                <div class="date-short">
                                    <a v-if="day.shareURL" :href="day.shareURL.toString()" @click="$emit('close')">
                                        {{ day.dateStrShort }}
                                    </a>
                                    <template v-else>
                                        {{ day.dateStrShort }}
                                    </template>
                                </div>
                                <div class="date-long">
                                    <a v-if="day.shareURL" :href="day.shareURL.toString()" @click="$emit('close')">
                                        {{ day.dateStr }}
                                    </a>
                                    <template v-else>
                                        {{ day.dateStr }}
                                    </template>
                                </div>
                                <div class="date-weekday">
                                    {{ day.dateWeekDay }}
                                </div>
                            </td>
                            <td class="word-cell">
                                <a v-if="day.shareURL" class="word" :href="day.shareURL.toString()" @click="$emit('close')">
                                    {{ day.word }}
                                </a>
                                <div v-else class="word">
                                    {{ day.word }}
                                </div>
                            </td>
                            <td class="grade-cell">
                                <a v-if="day.finalGrade && day.shareURL" class="grade grade-color"
                                    :class="[day.finalLetterGradeSimple]" :href="day.shareURL.toString()"
                                    @click="$emit('close')">
                                    <div class="letter">{{ day.finalLetterGrade }}</div>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- <div class="buttons full"> -->
            <button class="button full" @click="showMore">
                Show More
            </button>
            <!-- </div> -->
        </template>
    </Modal>
</template>

<style scoped>
.table {
    border-collapse: collapse;
}

.table td {
    padding: 0.2em 1em;
}

.date-cell {
    vertical-align: middle;
}

.date-long {
    display: none;
    white-space: nowrap;
}

.date-weekday {
    font-size: 0.8em;
    color: var(--gray-2);
}

.word {
    background: var(--color-absent);
    color: var(--tile-text-color);
    text-transform: uppercase;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5em;
    height: 2.5em;
    text-align: center;
    text-decoration: none;
}

.grade {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 3em;
    height: 2.5em;
    text-align: center;
    font-size: 1em;
    text-decoration: none;
}

.grade .letter {
    font-size: 1.5em;
}

@media screen and (min-width: 30em) {
    .date-short {
        display: none;
    }

    .date-long {
        display: block;
    }
}
</style>
