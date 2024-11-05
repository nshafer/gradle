<script setup lang="ts">
import { reactive, onBeforeMount, watch } from 'vue';

import ReloadPrompt from './components/ReloadPrompt.vue';
import MainInterface from './components/MainInterface.vue';
import HelpModal from './components/HelpModal.vue';
import FilterModal from './components/FilterModal.vue';
import HistoryModal from './components/HistoryModal.vue';
import SettingsModal from './components/SettingsModal.vue';
import StrikeModal from './components/StrikeModal.vue';

import IconCircleQuestion from './components/icons/IconCircleQuestion.vue';
import IconClockRotateLeft from './components/icons/IconClockRotateLeft.vue';
import IconGear from './components/icons/IconGear.vue';
import IconFan from './components/icons/IconFan.vue';
import IconThoughtBubble from './components/icons/IconThoughtBubble.vue';

import { settings, initSettings } from './settings';
import { answers, loadAnswers } from './answers';

// Initialize settings once when the main app is mounted
onBeforeMount(() => {
    initSettings();
    loadAnswers();
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
    filter: false,
    history: false,
    settings: false,
    strike: true,
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
    <template v-if="answers.loaded">
        <div class="app-header">
            <div class="app-header__buttons">
                <button class="app-header__button" @click="openModal('help')">
                    <IconCircleQuestion />
                </button>
                <button class="app-header__button" @click="openModal('filter')">
                    <IconThoughtBubble />
                </button>
            </div>

            <a href="/" class="app-header__title">
                Gradle
            </a>

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

        <FilterModal :visible="modals.filter" @close="closeModal('filter')" />

        <HistoryModal :visible="modals.history" @close="closeModal('history')" />

        <SettingsModal :visible="modals.settings" @close="closeModal('settings')" />

        <StrikeModal :visible="modals.strike" @close="closeModal('strike')" />

        <ReloadPrompt />
    </template>

    <template v-else-if="answers.errored">
        <div class="full-center">
            <div class="error-text">
                {{ answers.error }}
            </div>
        </div>
    </template>

    <template v-else>
        <div class="full-center">
            <div class="app-busy">
                <IconFan />
            </div>
        </div>
    </template>
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

    .full-center {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }

    .error-text {
        font-size: 1.5rem;
        text-align: center;
        padding: 1em;
        background: var(--error);
        color: var(--white);
    }

    .app-busy {
        height: 3em;
        animation: rotate-ccw 2s infinite linear;
    }

    @keyframes rotate-ccw {
        100% {
            transform: rotate(-360deg);
        }
    }

    svg {
        height: 100%;
        width: auto;
    }

    .icon-inline {
        display: inline-block;
        height: 1em;
        vertical-align: -0.15em;
    }

    a {
        color: var(--gray-1);
    }

    a:hover, a:focus {
        color: var(--gray-2);
    }

    .button {
        background: var(--button-background);
        color: var(--button-text);
        padding: .65em 1em .55em;
        border: none;
        font-size: 1em;
        line-height: 1;
        cursor: pointer;
        font-size: 1rem;
    }

    .buttons {
        display: flex;
        flex-flow: row nowrap;
        margin-bottom: 1em;
        margin: -.25em;
    }

    .buttons .button {
        margin: .25em;
    }

    .button.full {
        width: 100%;
    }

    .button.primary {
        background-color: var(--color-correct);
    }

    .button.with-icon-left {
        position: relative;
        padding-left: 2.25em;
    }

    .button.with-icon-right {
        position: relative;
        padding-right: 2.25em;
    }

    .button svg {
        height: 1em;
        width: auto;
    }

    .button.with-icon-left svg {
        position: absolute;
        top: 50%;
        left: .5em;
        height: 1.25em;
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
        display: block;
        color: var(--gray-2);
        background: none;
        border: none;
        font-size: 1.1rem;
        height: 2.25em;
        min-width: 2em;
        margin: 0;
        padding: .5em 0.25em;
        cursor: pointer;
    }

    .button.icon.lg {
        padding: .25em;
    }

    .button.icon svg {
        height: 100%;
        width: auto;
    }

    .tile {
        padding: .25em .5em;
        background: var(--color-absent);
        color: var(--tile-text-color);
        text-transform: uppercase;
        font-weight: bold;
        width: 1.7em;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }

    .tile.correct {
        background-color: var(--color-correct);
    }

    .tile.present {
        background-color: var(--color-present);
    }

    .input {
        background: var(--input-bg);
        width: 100%;
        color: var(--input-text-color);
        border: 1px solid var(--input-border);
        padding: .2em .4em;
    }

    .input:focus-visible {
        border-color: var(--input-border-focus);
    }

    .input.error {
        background-color: var(--input-bg-error);
        border-color: var(--input-border-error);
        animation: Shake 600ms;
    }

    .input.error:focus-visible {
        border-color: var(--input-border-error);
    }

    .input::placeholder {
        letter-spacing: normal;
        text-transform: none;
        color: var(--input-placeholder-color);
        font-weight: normal;
    }

    .multi-switch {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        align-items: center;
    }

    .multi-switch label {
        background-color: var(--gray-5);
        color: var(--gray-1);
        font-size: 1rem;
        line-height: 1;
        text-align: center;
        padding: .5rem 1rem;
        border: 1px solid var(--gray-4);
    }

    .multi-switch label~label {
        border-left-color: transparent;
    }

    .multi-switch input {
        position: absolute;
        width: 1px;
        height: 1px;
        left: -9999px;
        top: -9999px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
    }

    .multi-switch label:hover {
        cursor: pointer;
    }

    .multi-switch input:focus+label {
        border: 1px solid var(--white);
    }

    .multi-switch input:checked+label {
        background-color: var(--button-background);
        color: var(--button-text);
    }

    @keyframes Shake {
        10%,
        90% {
            transform: translateX(-2px);
        }
        
        20%,
        80% {
            transform: translateX(4px);
        }
        
        30%,
        50%,
        70% {
            transform: translateX(-8px);
        }
        
        40%,
        60% {
            transform: translateX(2px);
        }
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
        text-decoration: none;
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

    @media screen and (min-width: 70em) {
        .section__body {
            padding: 1em;
        }
    }

    .grade {
        width: 5em;
        padding: .5em;
        display: inline-flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }

    .grade .letter {
        flex: 0 0 auto;
        font-size: 2.5em;
        text-shadow: 3px 2px 12px rgba(0, 0, 0, 0.7);
    }

    .grade .label {
        font-size: 1.1em;
        font-weight: bold;
    }

    .grade-color {
        background: var(--gray-5) !important;
    }

    .grade-color.a {
        background: var(--grade-a-bg) !important;
        color: var(--grade-a-fg) !important;
    }

    .grade-color.b {
        background: var(--grade-b-bg) !important;
        color: var(--grade-b-fg) !important;
    }

    .grade-color.c {
        background: var(--grade-c-bg) !important;
        color: var(--grade-c-fg) !important;
    }

    .grade-color.d {
        background: var(--grade-d-bg) !important;
        color: var(--grade-d-fg) !important;
    }

    .grade-color.f {
        background: var(--grade-f-bg) !important;
        color: var(--grade-f-fg) !important;
    }

    strong {
        font-size: 1.2em;
    }

    /* hijacked for variable letters */
    small {
        font-style: italic;
        font-size: 1em;
        font-weight: bold;
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

    .text-right {
        text-align: right;
    }

    .text-small {
        font-size: .8em;
    }
    
    .text-muted {
        color: var(--gray-2);
    }

    .mt-a {
        margin-top: auto !important;
    }

    .mt-0 {
        margin-top: 0 !important;
    }
    
    .mt-1 {
        margin-top: .25em !important;
    }

    .mt-2 {
        margin-top: .5em !important;
    }

    .mt-3 {
        margin-top: 1em !important;
    }

    .mt-4 {
        margin-top: 1.5em !important;
    }

    .mt-5 {
        margin-top: 2em !important;
    }

    .mb-a {
        margin-bottom: auto !important;
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

    .ml-a {
        margin-left: auto !important;
    }

    .ml-2 {
        margin-left: .5em !important;
    }

    .mr-a {
        margin-right: auto !important;
    }

    .px-3 {
        padding-left: 1em !important;
        padding-right: 1em !important;
    }

    .pt-0 {
        padding-top: 0 !important;
    }

    .pt-3 {
        padding-top: 1em !important;
    }

    .pb-0 {
        padding-bottom: 0 !important;
    }

    .pb-3 {
        padding-bottom: 1em !important;
    }

    .bt-1 {
        border-top: 1px solid var(--gray-4);
    }

    .bb-1 {
        border-bottom: 1px solid var(--gray-4);
    }
</style>
