// App-wide settings
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { reactive, watch } from 'vue';
import { dateIndex } from './game';

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

export function saveByPuzzleDate(date: Date, shareCode: string) {
    const day = dateIndex(date);
    if (day < 0 || day > 65535) {
        throw new Error("date must be between 0 and 65535, inclusive");
    }
    safeSetItem(`day-${day}`, shareCode);
}

export function loadByPuzzleDate(date: Date): string | null {
    const day = dateIndex(date);
    if (day < 0 || day > 65535) {
        throw new Error("date must be between 0 and 65535, inclusive");
    }
    return window.localStorage.getItem(`day-${day}`);
}

export function saveByPuzzleAnswer(answer: string, shareCode: string) {
    safeSetItem(`answer-${answer}`, shareCode);
}

export function loadByPuzzleAnswer(answer: string): string | null {
    return window.localStorage.getItem(`answer-${answer}`);
}

function safeSetItem(key: string, val: any) {
    // Try five times to set the item. If we get a quota exceeded error, then clear out something from local storage
    // and try again.
    for (let i = 0; i < 5; i++) {
        try {
            window.localStorage.setItem(key, val);
            return;
        } catch (e) {
            console.log("Could not set item in local storage", key, val, e);
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
