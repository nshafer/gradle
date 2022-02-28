<script setup lang="ts">
import { computed } from 'vue';

import Modal from './Modal.vue';
import { settings } from '../settings';

defineProps(['visible']);
defineEmits(['close']);

const version = computed(() => {
    return GITVERSION;
});
</script>

<template>
    <Modal v-show="visible" @close="$emit('close')" title="Help / About">
        <template #body>
            <div class="settings">
                <div class="setting">
                    <div class="setting__label">
                        <div class="setting__title">
                            Dark Mode
                        </div>
                        <div class="setting__subtitle">
                            Switch to a darker color palette.
                        </div>
                    </div>

                    <div class="setting__control">
                        <label class="toggle">
                            <input type="checkbox" v-model="settings.darkMode">
                            <div class="slider"/>
                        </label>
                    </div>
                </div>
                
                <div class="setting">
                    <div class="setting__label">
                        <div class="setting__title">
                            Color Blind
                        </div>
                        <div class="setting__subtitle">
                            Switch to colors that are easier to distinguish.
                        </div>
                    </div>

                    <div class="setting__control">
                        <label class="toggle">
                            <input type="checkbox" v-model="settings.colorBlind">
                            <div class="slider"/>
                        </label>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <small>© 2022 Wordle-Helper.app</small>
            <small>{{ version }}</small>
        </template>
    </Modal>
</template>

<style scoped>
.setting {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 1em 0;
    border-bottom: 1px solid var(--gray-4);
}

.setting__title {
    font-size: 1.1em;

}

.setting__subtitle {
    font-size: .9em;
    color: var(--gray-2);
}

/* .setting__control {
} */

.toggle {
    position: relative;
    display: block;
    width: 50px;
    height: 30px;
}

.toggle input {
    visibility: hidden;
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
    left: -9999px;
}

.toggle .slider {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    cursor: pointer;
    background: var(--button-background);
    transition: all .25s;
}

.toggle .slider::before {
    content: "";
    display: block;
    position: absolute;
    background: var(--button-text);
    top: 3px;
    left: 3px;
    bottom: 3px;
    width: 60%;
    transition: all .25s;
}

.toggle input:checked + .slider {
    background: var(--color-correct);
}

.toggle input:checked + .slider::before {
    transform: translateX(50%);
}

</style>
