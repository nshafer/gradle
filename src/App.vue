<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue';

import ReloadPrompt from './components/ReloadPrompt.vue';
import MainInterface from './components/MainInterface.vue';
import HelpModal from './components/HelpModal.vue';
import HistoryModal from './components/HistoryModal.vue';
import SettingsModal from './components/SettingsModal.vue';

import IconCircleQuestion from './components/icons/IconCircleQuestion.vue';
import IconClockRotateLeft from './components/icons/IconClockRotateLeft.vue';
import IconGear from './components/icons/IconGear.vue';

import { settings, loadSettings } from './settings';

// Load settings once when the main app is mounted
onMounted(() => {
    loadSettings();
});

// Update the class on <body> whenever the darkMode setting changes
watch(() => settings.darkMode, (newValue) => {
    if (newValue) {
        document.body.classList.add("darktheme");
    } else {
        document.body.classList.remove("darktheme");
    }
});

// Same for color blind mode to match the game
watch(() => settings.colorBlind, (newValue) => {
    if (newValue) {
        document.body.classList.add("colorblind");
    } else {
        document.body.classList.remove("colorblind");
    }
});

// Modals
const modals: {[name: string]: boolean} = reactive({
    help: false,
    history: false,
    settings: false,
})

function closeAllModals() {
    for (const name of Object.keys(modals)) {
        modals[name] = false;
    }
}

function openModal(name: string) {
    closeAllModals()
    modals[name] = true;
}

function closeModal(name: string) {
    modals[name] = false;
}
</script>

<template>
    <div class="app-header">
        <div class="app-header__buttons">
            <button class="app-header__button" @click="openModal('help')">
                <IconCircleQuestion />
            </button>
        </div>

        <div class="app-header__title">Gradle</div>

        <div class="app-header__buttons right">
            <button class="app-header__button" @click="openModal('history')">
                <IconClockRotateLeft />
            </button>
            <button class="app-header__button" @click="openModal('settings')">
                <IconGear />
            </button>
        </div>
    </div>

    <MainInterface />

    <HelpModal :visible="modals.help" @close="closeModal('help')" />

    <HistoryModal :visible="modals.history" @close="closeModal('history')" />

    <SettingsModal :visible="modals.settings" @close="closeModal('settings')" />

    <ReloadPrompt />
</template>

<style>
    #app {
        max-width: 80rem;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
    }

    main {
        flex: 1;
    }

    svg {
        height: 100%;
        width: auto;
    }

    a {
        color: var(--gray-1);
    }

    a:hover, a:focus {
        color: var(--gray-2);
    }

    .buttons {
        display: flex;
        flex-flow: row nowrap;
        margin-bottom: 1em;
        margin: -.25em;
    }

    .button {
        background: var(--button-background);
        color: var(--button-text);
        padding: .5em 1em;
        border: none;
        font-size: 1em;
        line-height: 1;
        cursor: pointer;
    }

    .buttons .button {
        margin: .25em;
    }

    .button.full {
        width: 100%;
    }

    .button.with-icon-left {
        position: relative;
        padding-left: 2em;
    }

    .button.with-icon-right {
        position: relative;
        padding-right: 2em;
    }

    .button svg {
        height: 1em;
        width: auto;
    }

    .button.with-icon-left svg {
        position: absolute;
        top: 50%;
        left: .5em;
        height: 1.5em;
        transform: translateY(-50%);
    }

    .button.with-icon-right svg {
        position: absolute;
        top: 50%;
        right: .5em;
        height: 1.5em;
        transform: translateY(-50%);
    }

    .button.icon {
        color: var(--gray-2);
        background: none;
        border: none;
        min-width: 2em;
        height: 2em;
        margin: 0;
        padding: .5em;
        cursor: pointer;
    }

    .button.icon.lg {
        padding: .25em;
    }

    .button.icon svg {
        height: 100%;
    }

    .app-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        border-bottom: 2px solid var(--gray-4);
        padding: .25em;
        margin-bottom: .5em;
        height: var(--header-height);
    }

    .app-header__buttons.right {
        text-align: right;
    }

    .app-header__button {
        color: var(--gray-2);
        background: none;
        border: none;
        height: 2.5em;
        margin: 0;
        padding: .5em;
        cursor: pointer;
    }

    .app-header__title {
        font-size: 1.5em;
        line-height: 1;
        margin-left: auto;
        margin-right: auto;
        white-space: nowrap;
    }

    .app-header__menu {
        display: flex;
        flex-flow: row nowrap;

        margin: 0;
        padding: 0;
        list-style: none;
    }

    .section {
        /* padding: .75em .5em; */
        margin-bottom: 1em;
        background: var(--gray-5);
        border: 1px solid transparent;
    }

    .section h1 {
        text-align: center;
        font-size: 1.2em;
        line-height: 1;
        margin: 0;
        /* margin: 0 1em .25em; */
    }

    .section h2 {
        font-size: 1.1em;
        margin: 0 0 1em;
    }

    .section p {
        margin: 0 0 1em;
    }

    .section__header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: .25em .5em;
        height: 3em;
        border-bottom: 1px solid var(--gray-3);
    }

    .section__body {
        padding: .75em .5em;
    }

    @media screen and (min-width: 60em) {
        .section__body {
            padding: 1em;
        }
    }

    strong {
        font-size: 1.2em;
    }

    .middle-center {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
    }

    .text-center {
        text-align: center;
    }

    .text-muted {
        color: var(--gray-2);
    }

    .mt-a {
        margin-top: auto !important;
    }

    .mt-3 {
        margin-top: 1em !important;
    }

    .mb-0 {
        margin-bottom: 0 !important;
    }

    .mb-1 {
        margin-bottom: .25em !important;
    }

    .mb-2 {
        margin-bottom: .5em !important;
    }

    .mb-3 {
        margin-bottom: 1em !important;
    }

    .mb-4 {
        margin-bottom: 1.5em !important;
    }

    .mb-5 {
        margin-bottom: 2em !important;
    }

    .pt-3 {
        padding-top: 1em !important;
    }

    .bt-1 {
        border-top: 1px solid var(--gray-4);
    }

    .bb-1 {
        border-bottom: 1px solid var(--gray-4);
    }
</style>
