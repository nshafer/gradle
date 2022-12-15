<script setup lang="ts">
import { computed, reactive } from 'vue';
import Solver from '@/solver';
import { allowedWords } from '@/words';
import Modal from './Modal.vue';

import IconTrashCanUndo from './icons/IconTrashCanUndo.vue';

defineProps(['visible']);
defineEmits(['close']);

const letters = reactive({
    l1: '',
    l2: '',
    l3: '',
    l4: '',
    l5: '',
})

function selectAll(event: Event) {
    if (event.target && event.target instanceof HTMLInputElement) {
        event.target.select();
    }
}

const validLettersRegex = /[^abcdefghijklmnopqrstuvwxyz]/ig;

function cleanLetters(val: string): string | null {
    if (val && typeof val === "string") {
        val = val.toLowerCase().replaceAll(validLettersRegex, "");
        return val ? val : null;
    } else {
        return null;
    }
}

const letter1 = computed(() => {
    return cleanLetters(letters.l1);
});

const letter2 = computed(() => {
    return cleanLetters(letters.l2);
});

const letter3 = computed(() => {
    return cleanLetters(letters.l3);
});

const letter4 = computed(() => {
    return cleanLetters(letters.l4);
});

const letter5 = computed(() => {
    return cleanLetters(letters.l5);
});

function updateLetter(letter: string, event: Event) {
    // We use this instead of v-model so we can fire on every input, which doesn't happen with
    // an IME that does composition, such as on mobile.
    if (event.target && event.target instanceof HTMLInputElement) {
        /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
        (letters as { [key: string]: any })[letter] = event.target.value;
    }
}

const hasInput = computed(() => {
    return letter1.value || letter2.value || letter3.value || letter4.value || letter5.value;
})

const matches = computed(() => {
    if (!hasInput.value) {
        return [];
    }

    console.time("filter");
    const solver = new Solver(
        [letter1.value, letter2.value, letter3.value, letter4.value, letter5.value],
        [null, null, null, null, null],
        [null, null, null, null, null]
    );
    const words = solver.filter(allowedWords);
    console.timeEnd("filter");

    return words;
})

function reset() {
    letters.l1 = '';
    letters.l2 = '';
    letters.l3 = '';
    letters.l4 = '';
    letters.l5 = '';
}

</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" title="Word Filter" fixedWidth fixedHeight>
        <template #content>
            <div class="layout">
                <div class="inputs">
                    <input class="input" type="text" :value="letters.l1" @input="updateLetter('l1', $event)" maxlength="1" @click="selectAll"/>
                    <input class="input" type="text" :value="letters.l2" @input="updateLetter('l2', $event)" maxlength="1" @click="selectAll" />
                    <input class="input" type="text" :value="letters.l3" @input="updateLetter('l3', $event)" maxlength="1" @click="selectAll" />
                    <input class="input" type="text" :value="letters.l4" @input="updateLetter('l4', $event)" maxlength="1" @click="selectAll" />
                    <input class="input" type="text" :value="letters.l5" @input="updateLetter('l5', $event)" maxlength="1" @click="selectAll" />
                    <button class="button icon" @click.stop="reset" title="Reset">
                        <IconTrashCanUndo />
                    </button>
                </div>

                <div v-if="matches.length > 0" class="words-container">
                    <div class="words">
                        <div v-for="word in matches" :key="word" class="word">
                            {{ word }}
                        </div>
                    </div>
                </div>

                <div v-else class="container">
                    <div v-if="hasInput" class="no-matches">
                        No matches
                    </div>
                    
                    <div v-else class="no-input">
                        <p>
                            This is a simple tool you can use to see what words have a certain letter in a certain place.
                            For example, if you want to see all words that start with "A", you can enter "A" in the first box.
                            Or you can enter "E" in the 4th box and "T" in the last box to see what words end in "ET".
                        </p>

                        <p>
                            The list of words that match come from the official list of allowed words.
                            This will not tell you if a word is the correct for a given puzzle.
                        </p>
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
.layout {
        height: 100%;
        display: grid;
        grid-template-rows: min-content auto;
        gap: 1em;
        margin: -1em;
    }

    .inputs {
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        gap: 1em;
        padding: 1em;
        border-bottom: 1px solid var(--gray-4);
    }

    .input {
        width: 1.5em;
        height: 1.5em;
        font-size: 1.25em;
        background: var(--input-primary-bg);
        color: var(--input-primary-text-color);
        text-transform: uppercase;
        font-weight: bold;
        text-align: center;
        border: none;
    }

    .words-container {
        overflow-y: auto;
        scrollbar-gutter: stable both-edges;
        padding: 0 1em;
    }
    
    .words {
        display: grid;
        grid-template-columns: repeat(auto-fill, 5em);
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

    .word:last-child {
        margin-right: auto;
    }

    .container {
        max-width: 30em;
        padding: 0 1em;
        margin-left: auto;
        margin-right: auto;
    }

    .no-matches, .no-input {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        /* max-width: 10em; */
    }

    .no-matches {
        font-size: 1.5em;
        padding: 1em 0;
    }
        
    @media screen and (min-width: 22em) {
        .input {
            font-size: 1.75em;
        }
    }
        
    @media screen and (min-width: 30em) {
        .input {
            font-size: 2em;
        }
    }
</style>
