// App-wide settings
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { reactive, watch } from 'vue';
import { encodeShareCode, decodeShareCode } from './encoding';
import { dateIndex } from './game';
import { Guess } from './guess';

// Exported settings and default value
export const settings: {[name: string]: any} = reactive({
    darkMode: false,
    colorBlind: false,
});

export function initSettings() {
    loadSettings();
    // Watch for changes and save them to local storage
    watch(settings, (newSettings, oldSettings) => {
        saveSettings();
    });
}

export function loadSettings() {
    for (const [key, val] of Object.entries(settings)) {
        settings[key] = decode(window.localStorage.getItem(key), val);
    }
    console.debug("Loaded settings", settings);
}

export function saveSettings() {
    console.debug("Saving settings", settings);
    for (const [key, val] of Object.entries(settings)) {
        safeSetItem(key, encode(val));
    }
}

function encode(val: any): string {
    return typeof(val) + ":" + val.toString();
}

function decode(val: string | null, def: any): any {
    if (val == null) {
        return def;
    } else if (val.includes(":")) {
        const [type, v] = val.split(":", 2);
        if (type == "string") {
            return v;
        } else if (type == "number") {
            return Number(v);
        } else if (type == "boolean") {
            return v == "true" ? true : false;
        } else {
            return def;
        }
    } else {
        return def;
    }
}

export function savePuzzle(guesses: Guess[], date?: Date, answer?: string): string | null {
    if (guesses.length <= 0) {
        console.error("Cannot save empty puzzle");
        return null;
    }
    
    const lastGuess = guesses[guesses.length - 1];
    if (!lastGuess.isComplete) {
        console.error("Cannot save incomplete puzzle");
        return null;
    }

    const words = guesses.map(value => value.word);

    let shareCode;
    if (date != undefined) {
        shareCode = encodeShareCode(words, date);
    } else if (answer != undefined) {
        shareCode = encodeShareCode(words, answer);
    } else {
        console.error("Cannot save without a date or answer");
        return null;
    }
    
    const puzzleState = encodePuzzleState(shareCode, lastGuess.finalGrade);
    
    let key;
    if (date) {
        const day = dateIndex(date);
        key = `day-${day}`;
    } else if (answer) {
        key =`answer-${answer}`;
    } else {
        console.error("Cannot save puzzle without a date or answer");
        return null;
    }

    safeSetItem(key, puzzleState);
    return key;

}

export function loadPuzzleByDate(date: Date): {shareCode: string, finalGrade: number} | null {
    const day = dateIndex(date);
    if (day < 0 || day > 65535) {
        throw new Error("date must be between 0 and 65535, inclusive");
    }

    const savedValue = window.localStorage.getItem(`day-${day}`);
    if (savedValue == null) {
        return null;
    } else {
        const puzzleState = decodePuzzleState(savedValue);
        if (!puzzleState.shareCode) {
            return null;
        }
        // If the loaded puzzle state is just a shareCode, then that's the old format, calculate the final grade
        // and save it back to local storage.
        if (puzzleState.finalGrade == undefined || isNaN(puzzleState.finalGrade)) {
            const finalGrade = getFinalGrade(puzzleState.shareCode);
            if (finalGrade) {
                puzzleState.finalGrade = finalGrade;
                const newValue = encodePuzzleState(puzzleState.shareCode, puzzleState.finalGrade);
                console.log(`Updating save state for day-${day} to ${newValue}`);
                safeSetItem(`day-${day}`, newValue);
            }
        }
        return puzzleState;
    }
}

export function loadPuzzleByAnswer(answer: string): {shareCode: string, finalGrade: number} | null {
    const savedValue = window.localStorage.getItem(`answer-${answer}`);
    if (savedValue == null) {
        return null;
    } else {
        const puzzleState = decodePuzzleState(savedValue);
        if (!puzzleState.shareCode) {
            return null;
        }
        // If the loaded puzzle state is just a shareCode, then that's the old format, calculate the final grade
        // and save it back to local storage.
        if (puzzleState.finalGrade == undefined || isNaN(puzzleState.finalGrade)) {
            const finalGrade = getFinalGrade(puzzleState.shareCode);
            if (finalGrade) {
                puzzleState.finalGrade = finalGrade;
                const newValue = encodePuzzleState(puzzleState.shareCode, puzzleState.finalGrade);
                console.log(`Updating save state for answer-${answer} to ${newValue}`);
                safeSetItem(`answer-${answer}`, newValue);
            }
        }
        return puzzleState;
    }
}


function getFinalGrade(shareCode: string) {
    const shareData = decodeShareCode(shareCode);
    const guesses = [];
    for (const word of shareData.words) {
        const guessIndex: number = guesses.length;
        const previous: Guess | undefined = guessIndex > 0 ? guesses[guessIndex - 1] : undefined;
        const guess: Guess = new Guess(word, guessIndex, shareData.answer, previous);
        guesses.push(guess);
    }
    if (guesses.length > 0) {
        return guesses[guesses.length - 1].finalGrade;
    } else {
        return null;
    }
}

function encodePuzzleState(shareCode: string, finalGrade: number): string {
    return `${shareCode};${finalGrade.toFixed(4)}`;
}

function decodePuzzleState(puzzleState: string): {shareCode: string, finalGrade: number} {
    const [shareCode, finalGrade] = puzzleState.split(";", 2);
    return {shareCode, finalGrade: Number(finalGrade)};
}

function safeSetItem(key: string, val: any) {
    // Try five times to set the item. If we get a quota exceeded error, then clear out something from local storage
    // and try again.
    for (let i = 0; i < 5; i++) {
        try {
            window.localStorage.setItem(key, val);
            return;
        } catch (e) {
            console.warn("Could not set item in local storage", key, val, e);
            if (e instanceof DOMException && e.code === DOMException.QUOTA_EXCEEDED_ERR) {
                clean(1);
            } else {
                throw(e);
            }
        }
    }
}

// This will remove `num` old share codes from local storage:
//   - First by removing share codes saved by answer randomly.
//   - Then by removing share codes starting with the oldest.
function clean(num: number) {
    const answerKeys = Object.keys(window.localStorage).filter(key => key.startsWith("answer-"));
    const dayKeys = Object.keys(window.localStorage).filter(key => key.startsWith("day-"));
    const sortedDayKeys = dayKeys.sort((a, b) => {
        const aDay = parseInt(a.split("-")[1]);
        const bDay = parseInt(b.split("-")[1]);
        return aDay - bDay;
    });

    const allKeys = answerKeys.concat(sortedDayKeys);
    const toRemove = allKeys.slice(0, Math.min(num, allKeys.length));
    for (const key of toRemove) {
        window.localStorage.removeItem(key);
    }
}
