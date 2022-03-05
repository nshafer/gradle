import { wordIndex } from './game';
import { answers, words } from './words';

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

export type GreensArray = Array<string | null>;
export type YellowsArray = Array<Array<string> | null>;
export type GraysArray = Array<string | null>;

export default class Solver {
    greens: GreensArray;
    yellows: YellowsArray;
    grays: GraysArray;

    // Expected input:
    //   greens: array length 5 of null or the green character in that position
    //   yellows: array length 5 of null or an array of yellows in that position
    //   grays: array length n of characters that are gray in any position
    //
    // String input (for easy test writing):
    //   greens: string, length 5, character or '_' if not green. Example: "_b__t"
    //   yellows: string, 0 or more characters in each position separated by ','. Example: "bt,a,,t,"
    //   grays: characters that are gray, separted by nothing or ','. Example: "rets"
    constructor(greens: GreensArray | string, yellows: YellowsArray | string, grays: GraysArray | string) {
        this.greens = this.parseGreens(greens);
        this.yellows = this.parseYellows(yellows);
        this.grays = this.parseGrays(grays);
    }

    parseGreens(input: GreensArray | string): GreensArray {
        if (Array.isArray(input)) {
            return input.slice(0, 5);
        } else if (typeof input === "string" && input.length === 5) {
            if (input.includes(",")) {
                return input.split(",", 5).map(c => c === '_' ? null : c);
            } else {
                return input.split("", 5).map(c => c === '_' ? null : c);
            }
        } else {
            throw "invalid greens input";
        }
    }

    parseYellows(input: YellowsArray | string): YellowsArray {
        if (Array.isArray(input)) {
            return input.slice(0, 5);
        } else if (typeof input === "string") {
            if (input.includes(",")) {
                return input.split(",").map(x => x.split(""));
            } else {
                throw "invalid yellows input";
            }
        } else {
            throw "invalid yellows input";
        }
    }

    parseGrays(input: GraysArray | string): GraysArray {
        if (Array.isArray(input)) {
            return input;
        } else if (typeof input === "string") {
            if (input.includes(",")) {
                return input.split(",");
            } else {
                return input.split("");
            }
        } else {
            throw "invalid grays input";

        }
    }

    check() {
        return true;
    }

    uniques(arr: Array<string | null>): string[] {
        arr = arr.filter(c => c != null);
        return [...new Set(arr)] as string[];
    }
    
    // All greens given
    allGreens() {
        return this.uniques(this.greens);
    }

    // All yellows given
    allYellows() {
        return this.uniques(this.yellows.flat());
    }

    // All grays given, minus any also given as green or yellow
    allGrays() {
        const allGreens = this.allGreens();
        const allYellows = this.allYellows();
        const grays = this.grays.filter(c => c != null && !allYellows.includes(c) && !allGreens.includes(c));
        return this.uniques(grays);
    }

    // All characters that are not gray, green or yellow
    allWhites() {
        const allGrays = this.allGrays();
        const whites = letters.filter(c => !allGrays.includes(c));
        return this.uniques(whites);
    }

    suggest() {
        return this.filter(words);
    }

    solve(removeOldAnswers = false) {
        if (removeOldAnswers) {
            const remainingAnswers = answers.slice(wordIndex());
            return this.filter(remainingAnswers);
        } else {
            return this.filter(answers);
        }
    }
    
    filter(wordlist: string[]) : string[] {
        const matchRegex = this.buildMatchRegex();
        // console.log("matchRegex", matchRegex);

        const includeRegex = this.buildIncludeRegex();
        // console.log("includeRegex", includeRegex);

        const excludeRegex = this.buildExcludeRegex();
        // console.log("exludeRegex", excludeRegex);

        return wordlist.filter(word => word.match(matchRegex) && word.match(excludeRegex) && word.match(includeRegex));
    }

    buildMatchRegex() {
        // Build the regex pattern for each position
        const patterns = [];
        for (let i = 0; i < 5; i++) {
            // If there is a green in this position, just match that
            if (this.greens[i] != null) {
                patterns[i] = this.greens[i];
            } else {
                // Otherwise, match anything
                patterns[i] = ".";
            }
        }

        // Build the final pattern
        const pattern = "^" + patterns.join("") + "$"
        return RegExp(pattern, 'i');
    }
    
    buildIncludeRegex() {
        const allGreens = this.allGreens();
        const allYellows = this.allYellows();
        const allGreensAndYellows = this.uniques(allGreens.concat(allYellows));

        const patterns = [];
        for (const c of allGreensAndYellows) {
            // Build a positive lookahead for each character to check if it exists anywhere in the string
            patterns.push("(?=.*" + c + ")")
        }

        // Build the final pattern
        const pattern = "^" + patterns.join("") + ".+"
        return RegExp(pattern, 'i');
    }
    
    buildExcludeRegex() {
        // Build an array for each character position of characters to not include
        const excludes: string[][] = [ [], [], [], [], [] ];

        // If a character appears once as a green or yellow character, then it could appear again as gray,
        // so we can't exclude them outright
        const allGrays = this.allGrays();

        // For each character position figure out what characters shouldn't be there.
        for (let i = 0; i < 5; i++) {
            // Exclude all grays
            excludes[i] = excludes[i].concat(allGrays);
            
            if (Array.isArray(this.yellows[i])) {
                // Exclude all yellows in this position since they are supposed to be in another position
                excludes[i] = excludes[i].concat(this.yellows[i] as string[]);
            }
        }

        // Build the regex pattern for each position
        const patterns = [];
        for (let i = 0; i < 5; i++) {
            // Exclude all determined characters in this position
            patterns[i] = "[^" + excludes[i].join("") + "]";
        }

        // Build the final pattern
        const pattern = "^" + patterns.join("") + "$"
        return RegExp(pattern, 'i');
    }
}

