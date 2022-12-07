import { reactive } from 'vue';

export const answers = reactive({
    list: [] as string[],
    loaded: false,
    errored: false,
    error: null as any,
})

export async function loadAnswers() {
    console.log("Loading answers...");
    try {
        // await new Promise(r => setTimeout(r, 2000));
        const response = await fetch('/answers.json');
        answers.list = await response.json();
        answers.loaded = true;
        console.log("Answers loaded");
    } catch (error) {
        answers.errored = true;
        answers.error = error;
        console.error(error);
    }
}

