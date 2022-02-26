// App-wide settings
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { reactive,  watch } from 'vue';

// Exported settings and default value
export const settings: {[name: string]: any} = reactive({
    darkMode: false,
    colorBlind: false,
});

// Watch for changes and save them to local storage
watch(settings, () => {
    saveSettings();
});

export function loadSettings() {
    for (const [key, val] of Object.entries(settings)) {
        settings[key] = decode(window.localStorage.getItem(key), val);
    }
    console.log("Loaded settings", settings);
}

export function saveSettings() {
    console.log("Saving settings", settings);
    for (const [key, val] of Object.entries(settings)) {
        window.localStorage.setItem(key, encode(val));
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
