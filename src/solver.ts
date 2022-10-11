import { wordIndex } from './game';
import { answers, words, allWords } from './words';

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

export type LetterArray = Array<string | null>;

export default class Solver {
    correct: LetterArray;
    present: LetterArray;
    absent: LetterArray;

    // Expected input:
    //   correct: array length 5 of null or the green character in that position
    //   present: array length 5 of null or the yellow character in that position
    //   absent: array length 5 of null or the gray character in that position
    //
    // String input (for easy test writing):
    //   correct: string, length 5, character or '_' if not green. Example: "_b__t"
    //   present: string, length 5, character or '_' if not yellow. Example: "u_a__"
    //   absent: string, length 5, character or '_' if not gray. Example: "___h_"
    constructor(correct: LetterArray | string, present: LetterArray | string, absent: LetterArray | string) {
        this.correct = this.parseInput(correct);
        this.present = this.parseInput(present);
        this.absent = this.parseInput(absent);
        // console.log("Solver correct", this.correct, "present", this.present, "absent", this.absent);
    }

    parseInput(input: LetterArray | string): LetterArray {
        if (Array.isArray(input)) {
            return input.slice(0, 5);
        } else if (typeof input === "string" && input.length === 5) {
            return input.split("", 5).map(c => c === '_' ? null : c);
        } else {
            throw new Error("invalid input");
        }
    }

    notNull(arr: Array<string | null>): string[] {
        return arr.filter(c => c != null) as string[];
    }
    
    uniques(arr: string[]): string[] {
        return [...new Set(arr)];
    }

    allCorrect() {
        return this.notNull(this.correct);
    }
    
    allPresent() {
        return this.notNull(this.present);
    }
    
    // All grays given, minus any also given as green or yellow
    allAbsent() {
        return this.notNull(this.absent);
    }

    filter(wordlist: string[]) : string[] {
        const matchRegex = this.buildMatchRegex();
        const includeRegex = this.buildIncludeRegex();
        const excludeRegex = this.buildExcludeRegex();
        
        // console.log("matchRegex", matchRegex, "includeRegex", includeRegex, "excludeRegex", excludeRegex);

        return wordlist.filter(word => word.match(matchRegex) && word.match(includeRegex) && word.match(excludeRegex));
    }

    // Build the regex pattern that matches a specific character in a specific position
    buildMatchRegex() {
        const patterns = [];
        for (let i = 0; i < 5; i++) {
            // If there is a green in this position, just match that
            if (this.correct[i] != null) {
                patterns[i] = this.correct[i];
            } else {
                // Otherwise, match anything
                patterns[i] = ".";
            }
        }

        // Build the final pattern
        const pattern = "^" + patterns.join("") + "$"
        return RegExp(pattern, 'i');
    }
    
    // Builds a regex that just makes sure that x number of letters match somewhere in the word
    buildIncludeRegex() {
        // Count the occurance of each correct and present letter
        const allCorrectAndPresent = this.allCorrect().concat(this.allPresent());
        const counts = allCorrectAndPresent.reduce((acc: Map<string, number>, l: string | null) => {
            if (l == null) {
                return acc;
            } else {
                const cur = acc.get(l) || 0;
                return acc.set(l, cur + 1);
            }
        }, new Map<string, number>());

        const patterns = [];
        for (const [c, n] of counts) {
            // Build a positive lookahead for each character to check if it exists exactly n times anywhere
            patterns.push(`(?=(?:.*${c}){${n}})`)
        }

        // Build the final pattern
        const pattern = "^" + patterns.join("") + ".+"
        return RegExp(pattern, 'i');
    }
    
    // Builds a regex that excludes all absent letters and excludes present in the position they are in
    buildExcludeRegex() {
        // Build an array for each character position of characters to not include
        const excludes: string[][] = [ [], [], [], [], [] ];

        // cache local copy of all* arrays
        const allAbsent = this.allAbsent();
        const allPresent = this.allPresent();

        // For each character position figure out what characters shouldn't be there.
        for (let i = 0; i < 5; i++) {
            // Exclude all grays from this position unless it's a green or yellow elsewhere
            excludes[i] = allAbsent.filter(c => c !== this.correct[i] && !allPresent.includes(c));
            
            // Exclude all yellows in this position since they are supposed to be in another position
            if (this.present[i] != null) {
                excludes[i].push(this.present[i]!);
            }

            // Exclude a specific gray in this position
            if (this.absent[i] != null) {
                excludes[i].push(this.absent[i]!);
            }

            // remove duplicate excludes in this position
            excludes[i] = this.uniques(excludes[i]);
        }

        // Build the regex pattern for each position
        const patterns = [];
        for (let i = 0; i < 5; i++) {
            if (excludes[i].length > 0) {
                // Exclude all determined characters in this position
                patterns[i] = "[^" + excludes[i].join("") + "]";
            } else {
                // Don't exclude anything in this position
                patterns[i] = ".";
            }
        }

        // Build the final pattern
        const pattern = "^" + patterns.join("") + "$"
        return RegExp(pattern, 'i');
    }
}

