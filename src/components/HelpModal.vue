<script setup lang="ts">
import Modal from './Modal.vue';

defineProps(['visible']);
defineEmits(['close']);
</script>

<template>
    <Modal v-show="visible" @close="$emit('close')" title="Help / About">
        <template #body>
            <p>
                TODO: rewrite
                Wordle is an excellent game, but sometimes you just get stuck and can't think of any words to try next.
                It's easy to paint yourself into a corner, especially if you're playing on hard mode.
                When that happens, Worldle Helper can give you hints on what to try next, without just giving you the answer.
            </p>

            <h3>Instructions</h3>

            <p>
                First, enter each green letter currently visible in your Wordle game, in the position that they are in.
                If you don't have a green for a given position, then leave it blank.
            </p>

            <p>
                Next, for each column of the game, enter all yellow letters visible in that position.
                You can enter multiple letters for each position if you have gotten multiple yellows in that column.
            </p>

            <p>
                Finally, enter all gray letters in the puzzle or on the keyboard at the bottom.
            </p>

            <p>
                Once you have entered the current "state" of the game, simply click the Results button.
                There you will be told how many possible answers it could be, and be given the option to see what words to try next.
                You can see possible answers, or just other english words that are not in the possible answer list, so you can type
                those in and just get more information on what letters might or might not be in the answer.
            </p>

            <p class="pt-3 bt-1">
                Wordle is © 2022 The New York Times Company.
                
                This App / Website is the product of skordle.app which has no
                affiliation with Wordle or The New York Times Company.
            </p>
        </template>
    </Modal>
</template>
