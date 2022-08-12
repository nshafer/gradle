<script setup lang="ts">
import { shuffleArray } from '@/util';
import { computed } from 'vue';

import Modal from './Modal.vue';

const props = defineProps<{
    visible: boolean,
    words: string[],
}>();
defineEmits(['close']);

const maxWords = 150;

const wordsShown = computed(() => {
    return shuffleArray(props.words).slice(0, maxWords);
});

const wordsNotShown = computed(() => {
    return Math.max(0, props.words.length - maxWords);
});

</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" :title="`${words.length} Possible Words`">
        <template #body>
            <div class="words">
                <div v-for="word in wordsShown" :key="word" class="word">
                    {{ word }}
                </div>
            </div>
            <div v-if="wordsNotShown > 0" class="words-not-shown">
                Plus {{ wordsNotShown }} more...
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .words {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        align-items: center;
        margin: -.25em;
    }

    .word {
        background: var(--color-absent);
        color: var(--tile-text-color);
        text-transform: uppercase;
        padding: .5em .5em;
        margin: .25em;
        /* min-width: 4em; */
        text-align: center;
    }

    .word:last-child {
        margin-right: auto;
    }

    .words-not-shown {
        padding: 1em;
        text-align: center;
    }

</style>
