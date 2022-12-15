<script setup lang="ts">
import Modal from './Modal.vue';

defineProps(['visible']);
defineEmits(['close']);
</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" title="Help / About">
        <template #content>
            <h3 class="mt-0">Description</h3>

            <p>
                Gradle will grade your Wordle game and give you a final grade based on how well you played.
                A good grade is obtained by reducing the list of possible words as much as possible with each guess.
            </p>

            <p>
                Each guess is first evaluated for correct (green), present (yellow) and absent (gray) letters.
                Then that information is used to filter which words in the list could possibly be the answer.
            </p>

            <p>
                The best grades are going to depend on the answer that day.
                Your favorite starting word or words may not always be the best guess if they don't reduce the
                possible list of words very much.
            </p>

            <h3 class="mt-0">Quickstart</h3>

            <ol>
                <li>
                    Play wordle in the official Wordle app.<br />
                    <span class="text-muted">This tool is not meant for playing wordle.</span>
                </li>
                <li>
                    Select which puzzle you want graded. Default is today.<br />
                    <span class="text-muted">Choose by date or by entering the answer.</span>
                </li>
                <li>
                    Enter each of your guesses in order.<br />
                    <span class="text-muted">Each guess will be graded. Click on it for more info.</span>
                </li>
                <li>
                    Get your final grade!<br />
                    <span class="text-muted">Share it with a unique link for discord, reddit, markdown, etc.</span>
                </li>
                <li>
                    Your wordle answers and grades are saved on this device.<br />
                    <span class="text-muted">See your puzzle history with the history button in the top right.</span>
                </li>
            </ol>

            <h3>Details</h3>

            <p>
                Gradle determines a grade by using information theory to figure out how many times a given guess cut the
                possible wordlist in half, also known as a <b>bit of information</b>
                (or sometimes <b>bits of entropy</b>).
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

        </template>
        <template #footer>
            <p class="text-small text-muted">
                Wordle is © 2022 The New York Times Company.
            </p>
            <p class="text-small text-muted">
                This App / Website is the product of gradle.app which has no
                affiliation with Wordle or The New York Times Company.
            </p>
        </template>
    </Modal>
</template>

