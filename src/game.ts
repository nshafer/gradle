import { answers } from './answers';

export const startDate = new Date(2021, 5, 19, 0, 0, 0, 0);

export function dateIndex(d: Date = new Date()): number {
    return Math.round((new Date(d).setHours(0, 0, 0, 0) - new Date(startDate).setHours(0, 0, 0, 0)) / 86400000);
}
// (window as any).dateIndex = dateIndex;

export function maxDateWithAnswer(): Date {
    return new Date(startDate.valueOf() + ((answers.list.length - 1) * 24 * 60 * 60 * 1000));
}
// (window as any).maxDateWithAnswer = maxDateWithAnswer;

export function wordIndex(d: Date = new Date()): number {
    const di = dateIndex(d);
    if (di > answers.list.length - 1) {
        return -1;
    } else {
        return di;
    }
}
// (window as any).wordIndex = wordIndex;

export function getWord(d: Date = new Date()): string {
    const wi = wordIndex(d);
    if (wi < 0) {
        return "";
    } else {
        return answers.list[wi];
    }
}
// (window as any).getWord = getWord;

export function getDateByDayOffset(offset: number, today: Date = new Date()): Date {
    return new Date(today.valueOf() + (offset * 24 * 60 * 60 * 1000));
}
// (window as any).getDateByDayOffset = getDateByDayOffset;

export function getDateByDateIndex(index: number): Date {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + index);
    return newDate;
}
// (window as any).getDateByDateIndex = getDateByDateIndex;

export function getWordByDayOffset(offset: number, today: Date = new Date()): string {
    const d = getDateByDayOffset(offset, today);
    return getWord(d);
}
// (window as any).getWordByDayOffset = getWordByDayOffset

export function letterGrade(grade: number): string {
    if (grade >= 0.97) {
        return "A+";
    } else if (grade >= 0.93) {
        return "A";
    } else if (grade >= 0.90) {
        return "A-";
    } else if (grade >= 0.87) {
        return "B+";
    } else if (grade >= 0.83) {
        return "B";
    } else if (grade >= 0.80) {
        return "B-";
    } else if (grade >= 0.77) {
        return "C+";
    } else if (grade >= 0.73) {
        return "C";
    } else if (grade >= 0.70) {
        return "C-";
    } else if (grade >= 0.67) {
        return "D+";
    } else if (grade >= 0.63) {
        return "D";
    } else if (grade >= 0.60) {
        return "D-";
    } else {
        return "F";
    }
}

export function letterGradeSimple(grade: number): string {
    return letterGrade(grade).toLowerCase().replaceAll("+", " plus").replaceAll("-", " minus")
}
