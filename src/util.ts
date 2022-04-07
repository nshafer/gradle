// Misc functions
/* eslint-disable  @typescript-eslint/no-explicit-any */

const dateFormatRegex = /(\d{4})-(\d{2})-(\d{2})/;

interface Sorter {
    value: any,
    sort: number,
}

export function shuffleArray(arr: Array<any>) {
    return arr
        .map((value: any) => ({ value: value, sort: Math.random() }))
        .sort((a: Sorter, b: Sorter) => a.sort - b.sort)
        .map((x: Sorter) => x.value);
}

const validLettersRegex = /[^abcdefghijklmnopqrstuvwxyz]/ig;

export function cleanLetters(val?: string): string {
    if (val) {
        return val.toLowerCase().replaceAll(validLettersRegex, "");
    } else {
        return "";
    }
}

export function isoDateString(date: Date): string {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const d = date.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export function parseDateString(date: string): Date | null {
    const m = date.match(dateFormatRegex);
    if (m) {
        const year = Number.parseInt(m[1]);
        const month = Number.parseInt(m[2]);
        const day = Number.parseInt(m[3]);
        return new Date(year, month-1, day);
    } else {
        return null;
    }
}

export function addDays(date: Date, offset: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    return newDate;
}
