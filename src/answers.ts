import { reactive } from 'vue';
import { maxDateWithAnswer } from './game';

export const answers = reactive({
    list: [] as string[],
    loaded: false,
    errored: false,
    error: null as any,
})

export async function loadAnswers() {
    console.log("Loading answers...");
    answers.loaded = false;
    answers.errored = false;
    answers.error = null;
    
    try {
        // await new Promise(r => setTimeout(r, 2000));
        const response = await fetch('/answers.json');
        answers.list = await response.json();
        if (checkAnswerList()) {
            answers.loaded = true;
            console.log("Answers loaded");
        }
    } catch (error) {
        answers.errored = true;
        answers.error = "Failed to load. Please refresh the page."
        console.error(error);
    }
}

function checkAnswerList(): boolean {
    const today = new Date();
    if (maxDateWithAnswer() < today) {
        answers.errored = true;
        answers.error = "Answers are out of date. Please refresh the page."
        return false;
    }
    return true;
}
