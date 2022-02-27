<script setup lang="ts">
import { ref, watch } from 'vue';
import { answers } from '../words';

import Modal from './Modal.vue';

const props = defineProps(['visible']);
defineEmits(['close']);

// Get the word for the days
const startDate = new Date(2021, 5, 19, 0, 0, 0, 0);
let today = new Date();
console.log("today", today);

watch(() => props.visible, (newValue) => {
    // Update today whenever this modal becomes visible
    if (newValue) {
        today = new Date();
        console.log("today", today);
    }
})

function wordIndex(d: Date) {
    return Math.round((new Date(d).setHours(0, 0, 0, 0) - new Date(startDate).setHours(0, 0, 0, 0)) / 86400000);
}

function getWord(d: Date) {
    const index = wordIndex(d) % answers.length;
    return answers[index];
}

function getDateByDayOffset(offset: number) {
    return new Date(today.valueOf() - (offset * 24 * 60 * 60 * 1000));
}

function getWordByDayOffset(offset: number) {
    const d = getDateByDayOffset(offset);
    return getWord(d);
}

// Control how many to show
const numWords = ref(10);

function showMore() {
    numWords.value += 10;
}

watch(() => props.visible, (newValue) => {
    if (newValue) {
        numWords.value = 10;
    }
});

</script>

<template>
    <Modal v-show="visible" @close="$emit('close')" title="Answer History">
        <template #body>
            <div class="mb-3">
                <div v-for="offset in numWords" class="entry">
                    <div class="date">
                        {{ getDateByDayOffset(offset).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'}) }}
                    </div>
                    <div class="word">
                        {{ getWordByDayOffset(offset) }}
                    </div>
                </div>
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
.entry {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: .25em 0;
    /* border-bottom: 1px solid var(--gray-4); */
}

.word {
    background: var(--color-absent);
    color: var(--input-text-color);
    text-transform: uppercase;
    padding: .5em 1em;
    min-width: 6em;
    text-align: center
}

</style>
