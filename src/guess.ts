import type { GreensArray, YellowsArray, GraysArray } from "./solver";
import Solver from "./solver";
import { allWords } from "./words";

enum HintState {
    Correct = "correct",
    Present = "present",
    Absent = "absent",
}

interface Hint {
    letter: string,
    state: HintState,
}

var id = 0;

function generateId(): number {
    return id++;
}

export class Guess {
    id: number;
    word: string;
    index: number;
    answer: string;
    previous?: Guess;
    isCorrect: boolean;
    
    letters: string[];
    hints: Hint[];

    // Count of hint colors for grading
    numCorrect: number;
    numPresent: number;
    numAbsent: number;

    // Letter colors for this and all previous guesses
    greens: GreensArray;
    yellows: YellowsArray;
    grays: GraysArray;
    
    // Words from the list remaining after this and all previous guesses
    solver?: Solver;
    wordsRemaining: string[] = [];

    // Reduction grading constants
    reductionExponent = 2;
    reductionMax = 5;

    // Hint grading constants
    hintExponent = 2;
    correctPoints = 1;
    presentPoints = 0.5;
    absentPoints = 0;
    maxHintPoints = 5;  // This should generally be correctPoints * 5

    constructor(word: string, index: number, answer: string, previous?: Guess) {
        this.id = generateId();
        this.word = word;
        this.index = index;
        this.answer = answer;
        this.previous = previous;
        this.isCorrect = this.word == this.answer;
        this.letters = word.split("");
        
        // Calculate the hint colors based on this word versus the given answer
        this.hints = this.calculateHints();
        this.numCorrect = this.hints.filter((hint) => hint.state == HintState.Correct).length;
        this.numPresent = this.hints.filter((hint) => hint.state == HintState.Present).length;
        this.numAbsent = 5 - this.numCorrect - this.numPresent;

        // Recursively gather all greens and yellows for the solver
        this.greens = this.gatherGreens();
        this.yellows = this.gatherYellows();
        this.grays = this.gatherGrays();

        this.wordsRemaining = this.solve();
    }

    calculateHints(): Hint[] {
        const answerLetters = this.answer.split("");
        const remainingLetters = [...answerLetters];
        const hints: Hint[] = [];

        // First set all letters and state to Absent
        for (const letter of this.letters) {
            hints.push({letter: letter, state: HintState.Absent});
        }

        // Now find all correct letters, removing them from remainingLetters
        for (let i = 0; i < hints.length; i++) {
            if (hints[i].letter == answerLetters[i]) {
                hints[i].state = HintState.Correct;
                remainingLetters.splice(i, 1);
            }
        }

        // For all hints that are still gray, determine if they are present elsewhere
        for (let i = 0; i < hints.length; i++) {
            if (hints[i].state == HintState.Absent && remainingLetters.indexOf(hints[i].letter) != -1) {
                hints[i].state = HintState.Present;
                remainingLetters.splice(remainingLetters.indexOf(hints[i].letter), 1);
            }
        }

        return hints;
    }

    gatherGreens(): GreensArray {
        let greens: GreensArray;
        if (this.previous) {
            greens = this.previous.gatherGreens();
        } else {
            greens = new Array(5).fill(null);
        }

        for (let i = 0; i < this.hints.length; i++) {
            if (this.hints[i].state == HintState.Correct) {
                greens[i] = this.hints[i].letter;
            }
        }

        return greens;
    }

    gatherYellows(): YellowsArray {
        let yellows: YellowsArray;
        if (this.previous) {
            yellows = this.previous.gatherYellows();
        } else {
            yellows = new Array(5).fill(null);
        }

        for (let i = 0; i < this.hints.length; i++) {
            if (this.hints[i].state == HintState.Present) {
                if (yellows[i] == null) {
                    yellows[i] = new Array();
                }
                yellows[i]!.push(this.hints[i].letter);
            }
        }

        return yellows;
    }

    gatherGrays(): GraysArray {
        let grays: GraysArray;
        if (this.previous) {
            grays = this.previous.gatherGrays();
        } else {
            grays = new Array();
        }

        for (let i = 0; i < this.hints.length; i++) {
            if (this.hints[i].state == HintState.Absent && !grays.includes(this.hints[i].letter)) {
                grays.push(this.hints[i].letter);
            }
        }

        return grays;
    }

    solve(): string[] {
        console.time("solve");
        this.solver = new Solver(this.greens, this.yellows, this.grays);
        const words = this.solver.filter(allWords);
        console.timeEnd("solve");
        return words;
    }

    get previousWordCount() {
        if (this.previous) {
            return this.previous.wordsRemaining.length;
        } else {
            return allWords.length;
        }
    }

    get wordCount() {
        return this.wordsRemaining.length;
    }
    
    get wordReduction() {
        return this.previousWordCount - this.wordCount;
    }

    get wordReductionPercent(): number {
        return this.wordReduction / this.previousWordCount;
    }

    get wordReductionPercentString(): string {
        return (this.wordReductionPercent * 100).toFixed(2).toString();
    }

    get wordReductionScore(): number {
        if (this.wordCount == 1) {
            return 1 * this.reductionMax;
        } else {
            return Math.pow(this.wordReductionPercent, this.reductionExponent) * this.reductionMax;
        }
    }

    get wordReductionScoreString(): string {
        return this.wordReductionScore.toFixed(2).toString();
    }

    get hintScore(): number {
        return (this.numCorrect * this.correctPoints) + (this.numPresent * this.presentPoints) + (this.numAbsent * this.absentPoints);
    }

    get hintScoreString(): string {
        return this.hintScore.toFixed(2).toString();
    }

    get score(): number {
        return this.wordReductionScore + this.hintScore;
    }

    get scoreString(): string {
        return this.score.toFixed(2).toString();
    }

    get scorePercent(): number {
        return this.score / (this.reductionMax + this.maxHintPoints);
    }

    get scorePercentString(): string {
        return (this.scorePercent * 100).toFixed(2).toString();
    }

    // get grade(): string {
    // }
}
