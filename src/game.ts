import { answers } from './words';

const startDate = new Date(2021, 5, 19, 0, 0, 0, 0);

export function dateIndex(d: Date = new Date()) {
    return Math.round((new Date(d).setHours(0, 0, 0, 0) - new Date(startDate).setHours(0, 0, 0, 0)) / 86400000);
}

export function wordIndex(d: Date = new Date()) {
    return dateIndex(d) % answers.length;
}

export function getWord(d: Date = new Date()) {
    return answers[wordIndex(d)];
}

export function getDateByDayOffset(offset: number, today: Date = new Date()) {
    return new Date(today.valueOf() + (offset * 24 * 60 * 60 * 1000));
}

export function getWordByDayOffset(offset: number, today: Date = new Date()) {
    const d = getDateByDayOffset(offset, today);
    return getWord(d);
}
