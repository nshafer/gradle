<script setup lang="ts">
import Modal from './Modal.vue';

defineProps(['visible']);
defineEmits(['close']);
</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" title="Help / About">
        <template #body>
            <h3>Gradle</h3>

            <p>
                Gradle will grade your Wordle game and give you a final grade based on how well you played.
                A good grade is obtained by reducing the list of possible words as much as possible with each guess.
            </p>

            <p>
                Each guess is first evaluated for correct (green), present (yellow) and absent (gray) letters.
                Then that information is used to filter which words in the list could possibly be the answer.
            </p>

            <p>
                The best grades are going to be depend on the answer that day.
                Your favorite starting word or words may not always be the best guess if they don't reduce the
                possible list of words very much.
            </p>

            <h3>Details</h3>

            <p>
                Gradle determines a grade by using information theory to figure out how many times a given guess cut the
                possible wordlist in half, also known as a <b>bit of information</b>.
                It compares how many bits your guess is worth against the <b>uncertainty</b>, or how many bits would be
                required to reduce the list to exactly 1 possibility, then plots that on an exponential curve to
                determine your final grade for each guess.
            </p>

            <p>
                A final grade is determined by averaging all grades. Any unused guesses are considered 100% guesses.
            </p>

            <p>
                More information can be found in the tooltips that break down exactly how your grade was calculated.
            </p>

            <p>
                This tool was heavily inspired by
                <a href="https://youtu.be/v68zYyaEmEA" target="_blank">Solving Wordle using information theory</a>
                by 3Blue1Brown.
            </p>

            <p class="pt-3 bt-1 text-small text-muted">
                Wordle is © 2022 The New York Times Company.
            </p>
            <p class="text-small text-muted">
                This App / Website is the product of gradle.app which has no
                affiliation with Wordle or The New York Times Company.
            </p>
        </template>
    </Modal>
</template>

