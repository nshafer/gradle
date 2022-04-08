<script setup lang="ts">
import { ref, watch } from 'vue';
import { getDateByDayOffset, getWordByDayOffset } from '../game';

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
    <Modal :visible="visible" @close="$emit('close')" title="Answer History">
        <template #body>
            <div class="mb-3">
                <div v-for="offset in numWords" :key="offset" class="entry">
                    <div class="date">
                        {{ getDateByDayOffset(-offset, today).toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'}) }}
                    </div>
                    <div class="word">
                        {{ getWordByDayOffset(-offset, today) }}
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
