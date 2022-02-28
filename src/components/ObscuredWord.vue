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
    <div class="wrapper" :class="wrapperClass" @click="reveal">
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
    cursor: pointer;
}

.wrapper.obscured {
    text-shadow: 0 0 15px var(--input-text-color);
    color: rgba(0, 0, 0, 0);
}
</style>
