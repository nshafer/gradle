<script setup lang="ts">
import { shuffleArray } from '@/util';
import { computed } from 'vue';

import Modal from './Modal.vue';

const props = defineProps<{
    visible: boolean,
    words: string[],
}>();
defineEmits(['close']);

const words = computed(() => {
    return shuffleArray(props.words);
});

</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" :title="`${words.length} Possible Words`" :fixed="false">
        <template #content>
            <div class="words">
                <div v-for="word in words" :key="word" class="word">
                    {{ word }}
                </div>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
.words {
        display: grid;
        grid-template-columns: repeat(auto-fill, 5em);
        justify-content: space-between;
        gap: .25em;
    }

    .word {
        background: var(--color-absent);
        color: var(--tile-text-color);
        text-transform: uppercase;
        padding: .5em 0;
        width: 5em;
        text-align: center;
    }

    @media screen and (min-width: 30em) {
        .words {
            min-width: 25em;
        }
    }

    @media screen and (min-width: 40em) {
        .words {
            min-width: 35em;
        }
    }

    @media screen and (min-width: 50em) {
        .words {
            min-width: 45em;
        }
    }
</style>
