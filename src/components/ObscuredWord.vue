<script setup lang="ts">
import { ref, computed } from 'vue';
import { shuffleArray } from '@/util';

const props = defineProps(['word']);
const visible = ref(false);

const wrapperClass = computed(() => ({
    visible: visible.value,
    obscured: !visible.value,
}));

const scrambled = computed(() => {
    return shuffleArray(props.word.split("")).join("");
});

function reveal() {
    console.log("reveal", visible, props.word);
    visible.value = true;
}

</script>

<template>
    <div class="wrapper" :class="wrapperClass">
        <div class="obscurer" @click="reveal"></div>
        <template v-if="visible">
            {{ word }}
        </template>
        <template v-else>
            {{ scrambled }}
        </template>
    </div>
</template>

<style>
.wrapper {
    padding: .5em 1em;
    position:relative;
}

.wrapper .obscurer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(255, 255, 255, .15);  
    backdrop-filter: blur(5px);
    border: 1px solid var(--gray-2);
}

.wrapper.visible .obscurer{
    display: none;
}

.wrapper.obscured .obscurer {
    display: block;
}
</style>
