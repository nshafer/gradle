<script setup lang="ts">
import { ref, computed } from 'vue';
import { shuffleArray } from '@/util';
import IconHandPointer from './icons/IconHandPointer.vue';

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
    visible.value = true;
}

</script>

<template>
    <div class="wrapper" :class="wrapperClass" @click="reveal">
        <template v-if="visible">
            {{ word }}
        </template>
        <template v-else>
            <div class="click">
                <IconHandPointer />
            </div>
            {{ scrambled }}
        </template>
    </div>
</template>

<style>
.wrapper {
    padding: .5em 1em;
    position: relative;
    cursor: pointer;
}

.click {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    color: var(--gray-2);
    text-shadow: none;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    padding: .75em;
    font-size: .8em;
}

.wrapper.obscured {
    text-shadow: 0 0 15px var(--input-text-color);
    color: rgba(0, 0, 0, 0);
}
</style>
