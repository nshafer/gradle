<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getDateByDayOffset, getWordByDayOffset } from '@/game';
import { loadByPuzzleDate } from '@/settings';

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
        const shareCode = loadByPuzzleDate(today);
        showToday.value = shareCode != null;
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

// Gather together the data for each day
const days = computed(() => {
    const words = [];
    for (let i = 0; i < numWords.value; i++) {
        if (i == 0 && !showToday.value) {
            continue;
        }

        const offset = i * -1;
        const date = getDateByDayOffset(offset, today);
        const shareCode = loadByPuzzleDate(date);

        let shareURL: URL | undefined;
        if (shareCode) {
            shareURL = new URL(window.location.href);
            shareURL.hash = shareCode;
        }

        words.push({
            offset: offset,
            dateStr: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }),
            word: getWordByDayOffset(offset, today),
            shareCode: shareCode,
            shareURL: shareURL,
        });
    }
    return words;
});

</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" title="Answer History">
        <template #body>
            <div class="mb-3">
                <div v-for="day in days" :key="day.offset" class="entry">
                    <div class="date">
                        <a v-if="day.shareURL" :href="day.shareURL.toString()" @click="$emit('close')">
                            {{ day.dateStr }}
                        </a>
                        <template v-else>
                            {{ day.dateStr }}
                        </template>
                    </div>
                    <div class="word">
                        {{ day.word }}
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

.date {
    padding-right: 2em;
}

.word {
    background: var(--color-absent);
    color: var(--tile-text-color);
    text-transform: uppercase;
    padding: .5em 1em;
    min-width: 6em;
    text-align: center
}

</style>
