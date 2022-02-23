<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue';

const props = defineProps(['word', 'solver']);

const letters = computed(() => {
    return props.word.split("");
});

const revealed: {[name: number]: boolean} = reactive({
    0: false, 1: false, 2: false, 3: false, 4: false
});

onMounted(() => {
    console.log("solver", props.solver);
    console.log("greens", props.solver.greens);
    for (let i = 0; i < 5; i++) {
        if (props.solver.greens[i] != null) {
            revealed[i] = true;
        }
    }
});

function reveal(i: number) {
    revealed[i] = true;
}

</script>

<template>
    <ul class="letters">
        <li v-for="(letter, i) in letters" :key="letter" class="letter"
                :class="{ visible: revealed[i], obscured: !revealed[i] }">
            <div class="obscurer" @click="reveal(i)"></div>
            {{ letter }}
        </li>
    </ul>
</template>

<style>
.letters {
    margin: -.25em;
    padding: .5em 1em;
    list-style: none;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    font-size: 1.1em
}

.letter {
    position: relative;
    margin: .25em;
    padding: 0.25em 0.5em;
    background: var(--color-correct);
    color: var(--input-text-color);
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
    border: none;
}

.letter .obscurer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(255, 255, 255, .15);  
    backdrop-filter: blur(5px);
    border: 1px solid var(--gray-2);
}

.letter.visible .obscurer{
    display: none;
}

.letter.obscured .obscurer {
    display: block;
}

@media screen and (min-width: 25em) {
    .letters {
        font-size: 1.4em;
    }
}

@media screen and (min-width: 30em) {
    .letters {
        font-size: 1.7em;
    }
}


</style>
