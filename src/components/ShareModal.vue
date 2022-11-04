<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Guess } from '@/guess';
import { dateIndex } from '@/game';
import { settings } from '@/settings';

import Modal from './Modal.vue';
import ToolTip from './ToolTip.vue';

import IconCopy from "./icons/IconCopy.vue";
import IconShare from "./icons/IconShare.vue";

const props = defineProps<{
    visible: boolean,
    guesses: Guess[],
    completed: boolean,
    busted: boolean,
    hardMode: boolean,
    finalLetterGrade: string,
    puzzleDate?: Date,
    puzzleAnswer?: string,
    shareURL: string,
}>();
defineEmits(['close']);

const textType = ref("plain")
const showCopiedTooltip = ref(false);

const shareText = computed(() => {
    let hashtag: string;
    if (props.puzzleDate != null) {
        hashtag = "#Wordle" + dateIndex(props.puzzleDate!);
    } else {
        hashtag = "#Wordle";
    }

    const guessCount = props.busted ? "X/6" : `${props.guesses.length}/6`;
    const hard = props.hardMode ? "*" : "";

    let guessLines = [];

    if (textType.value == "table") {
        guessLines.push(`|Guess|Result|Grade|`);
        guessLines.push(`|:--:|:--:|:--:|`);
    }

    for (let guess of props.guesses) {
        const unicodeHints = settings.darkMode ? guess.unicodeHintsDark : guess.unicodeHints;

        let guessLine;
        switch (textType.value) {
            case "plain":
                guessLine = `${unicodeHints} ${guess.letterGrade}`
                break;
            case "reddit":
                guessLine = `${unicodeHints} >!${guess.word.toUpperCase()}!< ${guess.letterGrade}  `
                break;
            case "discord":
                guessLine = `${unicodeHints} ||\`${guess.word.toUpperCase() }\`|| ${guess.letterGrade}`
                break;
            case "table":
                guessLine = `|>!${guess.word.toUpperCase()}!<|${unicodeHints}|${guess.letterGrade}|`
                break;
            default:
                break;
        }
        guessLines.push(guessLine)
    }

    return `${hashtag} ${guessCount}${hard} Grade: ${props.finalLetterGrade}

${guessLines.join("\n")}

`
});

async function copy() {
    if (navigator.clipboard && navigator.clipboard.writeText != undefined) {
        await navigator.clipboard.writeText(shareText.value + props.shareURL);
        showCopiedTooltip.value = true;
        setTimeout(() => { showCopiedTooltip.value = false; }, 2000);
    } else {
        alert("Your browser doesn't support copying to the clipboard. Please copy the text manually.");
    }
}

const shareData = computed(() => {
    return {
        text: shareText.value,
        url: props.shareURL,
    }
});

const canShare = computed(() => {
    return navigator.share != undefined && navigator.canShare && navigator.canShare(shareData.value);
});

async function share() {
    if (canShare.value) {
        await navigator.share(shareData.value);
    } else if (navigator.clipboard && navigator.clipboard.writeText != undefined) {
        await copy();
    } else {
        alert("Your browser doesn't support sharing. Please copy the text manually.");
    }
}

</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" title="Share">
        <template #body>
            <div class="multi-switch">
                <input id="text-type-plain" type="radio" v-model="textType" value="plain" />
                <label for="text-type-plain">Plain</label>
                <input id="text-type-reddit" type="radio" v-model="textType" value="reddit" />
                <label for="text-type-reddit">Reddit</label>
                <input id="text-type-discord" type="radio" v-model="textType" value="discord" />
                <label for="text-type-discord">Discord</label>
                <input id="text-type-table" type="radio" v-model="textType" value="table" />
                <label for="text-type-table">Table</label>
            </div>

            <pre class="text">{{ shareText.trimEnd() }}</pre>

            <div class="buttons">
                <ToolTip :show="showCopiedTooltip">
                    <button class="share-button button with-icon-left" @click="copy">
                        <IconCopy />
                        Copy
                    </button>
                    <template #content>
                        Copied results to clipboard
                    </template>
                </ToolTip>

                <button v-if="canShare" class="button with-icon-left" @click="share">
                    <IconShare />
                    Share
                </button>
            </div>
        </template>
    </Modal>
</template>

<style scoped>
    .text {
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: monospace;
        line-height: 1.2rem;
        border: 1px solid var(--gray-4);
        padding: .5em;
    }
</style>
