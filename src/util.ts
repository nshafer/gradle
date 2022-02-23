// Misc functions
/* eslint-disable  @typescript-eslint/no-explicit-any */

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
