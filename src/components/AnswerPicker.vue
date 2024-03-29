<script setup lang="ts">
import { ref, nextTick, onBeforeMount, onMounted, watch } from 'vue';
import { getWord, startDate, maxDateWithAnswer } from '../game';
import { computed } from 'vue';
import { allowedWords } from '@/words';
import { addDays, isoDateString, parseDateString } from '@/util';
import { loadAnswers } from '@/answers';

const props = defineProps<{
    date?: Date
    answer?: string
}>();

const emit = defineEmits<{
    (e: 'updated', answer: string, date: Date | undefined): void,
}>();

// Toggle between setting answer by date or manually inputting
const inputType = ref("date");

function setDatePicker() {
    inputType.value = "date";
}

function setManualInput() {
    inputType.value = "manual";
    nextTick(() => {
        manualInputEl.value?.focus();
    });
}

// Set initial type and values
onMounted(() => {
    // console.log("AnswerPicker onMounted", props.date, props.answer);
    if (props.date) {
        inputType.value = "date";
        dateInput.value = isoDateString(props.date);
    } else if (props.answer) {
        inputType.value = "manual";
        manualInput.value = props.answer;
        // Set the date input's value to today so it doesn't throw "invalid date" error
        dateInput.value = isoDateString(new Date());
    }
});

// Date picker
const maxDate = ref(new Date());
const dateInput = ref("");
const dateInputEl = ref<HTMLInputElement | null>(null);

const dateSelected = computed(() => {
    const date = parseDateString(dateInput.value);
    if (date && date instanceof Date && !isNaN(date.getTime()) && date >= startDate && date <= maxDate.value) {
        return date;
    } else {
        return undefined;
    }
})

const dateAnswer = computed(() => {
    if (dateSelected.value !== undefined) {
        return getWord(dateSelected.value);
    } else {
        return ""
    }
});

function scheduleMaxDateUpdate() {
    const now = new Date();
    const midnight = addDays(now, 1);
    midnight.setHours(0, 0, 0, 0);
    // console.log("midnight", midnight);
    const delay = midnight.getTime() - now.getTime();
    setTimeout(maxDateTimer, delay);
    // console.log(`Will update max date in ${(delay / 1000 / 60 / 60).toFixed(2)} hours`);
}

async function maxDateTimer() {
    console.log("New day, setting maxDate", maxDate.value);
    await loadAnswers();
    updateMaxDate();
    scheduleMaxDateUpdate();
}

function updateMaxDate() {
    let max;

    // Set the maxDate to today unless our answer list hasn't been updated
    const today = new Date();
    const maxAnswerDate = maxDateWithAnswer();

    if (maxAnswerDate >= today) {
        max = today;
    } else {
        max = maxAnswerDate;
    }

    // If there is a dateMax in localStorage, which is the number of days to offset the maxDate, then adjust
    const dateMax = localStorage.getItem('dateMax');
    if (dateMax !== null) {
        max.setDate(max.getDate() + Number(dateMax))
    }

    // Update the maxDate
    maxDate.value = max;
}

onMounted(async () => {
    updateMaxDate();
    scheduleMaxDateUpdate();
});

watch(() => props.date, (newDate, oldDate) => {
    if (inputType.value == "date" && newDate) {
        dateInput.value = isoDateString(newDate);
    }
});


// Manual answer input
const manualInput = ref("");
const manualInputEl = ref<HTMLInputElement | null>(null);

const cleanedAnswer = computed(() => {
    const answer = manualInput.value.toLowerCase().trim();
    if (answer.length == 5 && allowedWords.includes(answer)) {
        return answer;
    } else {
        return "";
    }
});

// Compute the final answer based on type and inputs
const pickedAnswer = computed(() => {
    if (inputType.value == "date") {
        return dateAnswer.value;
    } else if (inputType.value == "manual") {
        return cleanedAnswer.value;
    } else {
        throw new Error("invalid inputType");
    }
});

const pickedDate = computed(() => {
    if (inputType.value == "date") {
        return dateSelected.value;
    } else {
        return undefined;
    }
});

const inputError = computed(() => {
    if (inputType.value == "date" && !dateAnswer.value) {
        return "Invalid date";
    } else if (inputType.value == "manual") {
        if (manualInput.value.length == 5 && !cleanedAnswer.value) {
            return "Invalid answer";
        }
    }
});

watch([pickedAnswer, pickedDate], ([newPickedAnswer, newPickedDate]) => {
    // console.log("AnswerPicker emit updated", newPickedAnswer, newPickedDate)
    emit("updated", newPickedAnswer, newPickedDate);
});


watch(() => props.answer, (newAnswer, oldAnswer) => {
    if (inputType.value == "manual" && newAnswer) {
        manualInput.value = newAnswer;
    }
});

</script>

<template>
    <div class="answer-picker">
        <div class="toggle">
            <input v-if="inputType == 'date'" ref="dateInputEl" v-model="dateInput"
                class="selection input date" type="date" placeholder="Date"
                min="2021-05-19" :max="isoDateString(maxDate)" />
            <div v-else class="selection date placeholder left" tabindex="0"
                @click="setDatePicker" @keyup.space="setDatePicker" @keyup.enter="setDatePicker">
                Pick Date
            </div>

            <input v-if="inputType == 'manual'" ref="manualInputEl" v-model="manualInput"
                class="selection input manual" type="text" placeholder="Answer" maxlength="5" />
            <div v-else class="selection manual placeholder right" tabindex="0"
                @click="setManualInput" @keyup.space="setManualInput" @keyup.enter="setManualInput">
                Enter Answer
            </div>
        </div>
        <div v-if="inputError" class="error">
            {{ inputError }}
        </div>
        <div class="puzzle-answer">{{ answer }}</div>
        <div class="puzzle-date">{{ date }}</div>
        <div class="picked-answer">{{ pickedAnswer }}</div>
        <div class="picked-date">{{ pickedDate }}</div>
    </div>
</template>

<style scoped>
    /* .answer-picker {
    } */

    .toggle {
        flex: 1;
        display: flex;
        flex-flow: row nowrap;
        justify-content: stretch;
        align-items: center;
        background: var(--gray-5);
        border-radius: 2em;
    }

    .selection {
        display: flex;
        flex: 1;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        border-radius: 2em;
        height: 2.5em;
        width: 100%;
    }

    .selection.input {
        background: none;
        border: none;
        background: var(--input-primary-bg);
        color: var(--input-primary-text-color);
        font-size: 1em;
        line-height: 1;
        padding: 0 .5em;
        text-align: center;
        width: 100%;
        z-index: 1;
    }

    .input::placeholder {
        color: var(--input-primary-placeholder-color);
    }

    .selection.placeholder {
        color: var(--gray-2);
        padding: 0 1em;
        cursor: pointer;
    }

    .selection.placeholder.left {
        padding-right: 1.5em;
        margin-right: -2em;
    }
    
    .selection.placeholder.right {
        padding-left: 1.5em;
        margin-left: -2em;
    }

    /* .input.date {
    } */

    .input.date::-webkit-calendar-picker-indicator {
        filter: invert(100%);
    }

    .input.manual {
        text-transform: uppercase;
        font-weight: bold;
        letter-spacing: .05em;
    }

    .error {
        font-size: 1.4em;
        text-align: center;
        padding: .5em 1em;
        background: var(--error);
        margin-top: 1em;
    }

    .puzzle-answer, .puzzle-date, .picked-answer, .picked-date {
        display: none;
    }
</style>
