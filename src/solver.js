import { answers, words} from './words';

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

export default class Solver {
    // Expected input:
    //   greens: array length 5 of null or the green character in that position
    //   yellows: array length 5 of null or an array of yellows in that position
    //   grays: array length n of characters that are gray in any position
    //
    // String input (for easy test writing):
    //   greens: string, length 5, character or '_' if not green. Example: "_b__t"
    //   yellows: string, 0 or more characters in each position separated by ','. Example: "bt,a,,t,"
    //   grays: characters that are gray, separted by nothing or ','. Example: "rets"
    constructor(greens, yellows, grays) {
        this.greens = this.parseGreens(greens);
        this.yellows = this.parseYellows(yellows);
        this.grays = this.parseGrays(grays);
    }

    parseGreens(input) {
        if (input instanceof Array) {
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

    parseYellows(input) {
        if (input instanceof Array) {
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

    parseGrays(input) {
        if (input instanceof Array) {
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

    uniques(arr) {
        return [...new Set(arr)];
    }
    
    // All greens given
    allGreens() {
        return this.uniques(this.greens.filter(c => c != null));
    }

    // All yellows given
    allYellows() {
        return this.uniques(this.yellows.flat());
    }

    // All grays given, minus any also given as green or yellow
    allGrays() {
        const allGreens = this.allGreens();
        const allYellows = this.allYellows();
        const grays = this.grays.filter(c => !allYellows.includes(c) && !allGreens.includes(c));
        return this.uniques(grays);
    }

    // All characters that are not gray, green or yellow
    allWhites() {
        const allGrays = this.allGrays();
        const whites = letters.filter(c => !allGrays.includes(c));
        return this.uniques(whites);
    }

    suggest() {
        return this.solve(words);
    }

    solve(wordlist=answers) {
        const matchRegex = this.buildMatchRegex();
        // console.log("matchRegex", matchRegex);

        const includeRegex = this.buildIncludeRegex();
        // console.log("includeRegex", includeRegex);

        const excludeRegex = this.buildExcludeRegex();
        // console.log("exludeRegex", excludeRegex);

        return wordlist.filter(word => word.match(matchRegex) && word.match(excludeRegex) && word.match(includeRegex));
    }

    buildMatchRegex() {
        // Build an array for each character position of characters to include
        const includes = [ [], [], [], [], [] ]

        // Build the regex pattern for each position
        const patterns = [];
        for (let i = 0; i < 5; i++) {
            // If there is a green in this position, just match that
            if (this.greens[i] != null) {
                patterns[i] = this.greens[i];
            } else {
                // Otherwise, build include and exclude character classes
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
        for (let c of allGreensAndYellows) {
            patterns.push("(?=.*" + c + ")")
        }

        // Build the final pattern
        const pattern = "^" + patterns.join("") + ".+"
        return RegExp(pattern, 'i');
    }
    
    buildExcludeRegex() {
        // Build an array for each character position of characters to not include
        const excludes = [ [], [], [], [], [] ]

        // If a character appears once as a green or yellow character, then it could appear again as gray,
        // so we can't exclude them outright
        const allGrays = this.allGrays();

        // For each character position figure out what characters shouldn't be there.
        for (let i = 0; i < 5; i++) {
            // Exclude all grays
            excludes[i] = excludes[i].concat(allGrays);
            
            // Exclude all yellows in this position
            excludes[i] = excludes[i].concat(this.yellows[i]);
        }

        // Build the regex pattern for each position
        const patterns = [];
        for (let i = 0; i < 5; i++) {
            // Otherwise, build include and exclude character classes
            patterns[i] = "[^" + excludes[i].join("") + "]";
        }

        // Build the final pattern
        const pattern = "^" + patterns.join("") + "$"
        return RegExp(pattern, 'i');
    }
}

