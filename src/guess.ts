import Solver from "./solver";
import type { GreensArray, YellowsArray, GraysArray } from './solver';
import { allWords, answers } from "./words";
import { letterGrade } from "./game";

export enum Hint {
    Correct = "correct",
    Present = "present",
    Absent = "absent",
}

var id = 0;

function generateId(): number {
    return id++;
}

class Calculable {
    // Base word lists all calculations are based on
    
    wordsRemaining: string[] = [];
    answersRemaining: string[] = [];

    get previousWordsRemaining(): string[] {
        throw new Error("Not Implemented");
    }

    get previousAnswersRemaining(): string[] {
        throw new Error("Not Implemented");
    }

    // Calculations based on the above
    
    get wordReduction() {
        return this.previousWordsRemaining.length - this.wordsRemaining.length;
    }

    get wordReductionPercent(): number {
        if (this.previousWordsRemaining.length <= 0) {
            return 0;
        } else {
            return this.wordReduction / this.previousWordsRemaining.length;
        }
    }

    // How many bits of uncertainty there are in the words remaining from the previous guess
    get uncertainty(): number {
        // `-log2(1 / numPrevious)` simplified
        return Math.log2(this.previousWordsRemaining.length);
    }

    // The probability that this guess was the correct one
    get probability(): number {
        if (this.previousWordsRemaining.length <= 0) {
            return 0;
        } else {
            return this.wordsRemaining.length / this.previousWordsRemaining.length;
        }
    }

    get fractional(): number {
        return 1 / this.probability;
    }

    get bits(): number {
        return Math.log2(1 / this.probability);
    }

    get percentage(): number {
        if (this.uncertainty <= 0) {
            return 0;
        } else {
            return this.bits / this.uncertainty;
        }
    }

    get grade(): number {
        return 1 - Math.pow(1 - this.percentage, 2);
    }

    get letterGrade(): string {
        return letterGrade(this.grade);
    }

    get letterGradeSimple(): string {
        return this.letterGrade.toLowerCase().replaceAll("+", " plus").replaceAll("-", " minus")
    }
}

export class Guess extends Calculable {
    id: number;
    word: string;
    index: number;
    answer: string;
    previous?: Guess;
    isCorrect: boolean;
    
    letters: Letter[] = [];
    resolvedLetters: Letter[] = [];

    constructor(word: string, index: number, answer: string, previous?: Guess) {
        super();

        this.id = generateId();
        this.word = word;
        this.index = index;
        this.answer = answer;
        this.previous = previous;
        this.isCorrect = this.word == this.answer;
        
        // Calculate the hint colors based on this word versus the given answer
        this.splitWord();
        this.calculateHints();
        this.calculateResolvedLetters();

        this.solve();
    }

    splitWord() {
        const letters = this.word.split("");
        for (let i = 0; i < letters.length; i++) {
            this.letters.push(new Letter(this, i, letters[i]));
        }
    }

    calculateHints() {
        const answerLetters = this.answer.split("");
        const remainingLetters = [...answerLetters];
        
        // Find all correct letters, removing them from remainingLetters
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].letter == answerLetters[i]) {
                this.letters[i].hint = Hint.Correct;
                remainingLetters.splice(i, 1);
            }
        }

        // For all hints that are still gray, determine if they are present elsewhere
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].hint == Hint.Absent && remainingLetters.indexOf(this.letters[i].letter) != -1) {
                this.letters[i].hint = Hint.Present;
                remainingLetters.splice(remainingLetters.indexOf(this.letters[i].letter), 1);
            }
        }
    }

    calculateResolvedLetters() {
        // Sort letters by desired resolution order. First greens, then yellows, then grays.
        // This is needed so that we observe their effects in the correct order.
        this.resolvedLetters = [
            ...this.letters.filter(l => l.hint == Hint.Correct),
            ...this.letters.filter(l => l.hint == Hint.Present),
            ...this.letters.filter(l => l.hint == Hint.Absent),
        ];

        // Update the letter's resolutionIndex so they can find their previous letter
        for (let i = 0; i < this.resolvedLetters.length; i++) {
            this.resolvedLetters[i].resolutionIndex = i;
        }
    }

    solve() {
        console.time("solve");

        // Start with a copy of the previous Guess's remaining words
        this.wordsRemaining = [...this.previousWordsRemaining];
        this.answersRemaining = [...this.previousAnswersRemaining];

        for (let letter of this.resolvedLetters) {
            this.wordsRemaining = letter.wordsRemaining = letter.solve(this.wordsRemaining);
            this.answersRemaining = letter.answersRemaining = letter.solve(this.answersRemaining);
        }
        
        console.timeEnd("solve");
    }

    get previousWordsRemaining() {
        if (this.previous) {
            return this.previous.wordsRemaining;
        } else {
            return allWords;
        }
    }

    get previousAnswersRemaining() {
        if (this.previous) {
            return this.previous.answersRemaining;
        } else {
            return answers;
        }
    }

    get grade(): number {
        if (this.isCorrect) {
            // Correct guesses are always 100% A+
            return 1;
        } else {
            return super.grade;
        }
    }
}

export class Letter extends Calculable {
    guess: Guess;
    letter: string;
    hint: Hint = Hint.Absent;

    // The position of this letter in the word in original order
    index: number;

    // The order in which this letter resolves during the solve
    resolutionIndex?: number;

    constructor(guess: Guess, index: number, letter: string) {
        super();

        this.guess = guess;
        this.index = index;
        this.letter = letter;
    }

    get previousLetter(): Letter | null {
        if (this.resolutionIndex == undefined) {
            throw new Error("Attempted to get previous letter before resolution order was resolved");
        } else if (this.resolutionIndex > 0) {
            const previousLetter = this.guess.letters.find(l => l.resolutionIndex == this.resolutionIndex! - 1);
            if (!previousLetter) {
                throw new Error(`Could not find previous letter in resolution order: ${this.resolutionIndex! - 1}`);
            }
            return previousLetter;
        } else {
            return null;
        }

    }
    
    get previousWordsRemaining() {
        if (this.previousLetter) {
            return this.previousLetter.wordsRemaining;
        } else {
            return this.guess.previousWordsRemaining;
        }
    }

    get previousAnswersRemaining() {
        if (this.previousLetter) {
            return this.previousLetter.answersRemaining;
        } else {
            return this.guess.previousAnswersRemaining;
        }
    }
    
    gatherGreens(): GreensArray {
        let greens: GreensArray;
        if (this.previousLetter) {
            greens = this.previousLetter.gatherGreens();
        } else {
            greens = new Array(5).fill(null);
        }

        if (this.hint == Hint.Correct) {
            greens[this.index] = this.letter;
        }
        
        return greens;
    }

    gatherYellows(): YellowsArray {
        let yellows: YellowsArray;
        if (this.previousLetter) {
            yellows = this.previousLetter.gatherYellows();
        } else {
            yellows = new Array(5).fill(null);
        }

        if (this.hint == Hint.Present) {
            if (yellows[this.index] == null) {
                yellows[this.index] = new Array();
            }
            yellows[this.index]!.push(this.letter);
        }
        
        return yellows;
    }

    gatherGrays(): GraysArray {
        let grays: GraysArray;
        if (this.previousLetter) {
            grays = this.previousLetter.gatherGrays();
        } else {
            grays = new Array();
        }

        if (this.hint == Hint.Absent) {
            grays.push(this.letter);
        }

        return grays;
    }

    solve(words: string[]): string[] {
        const greens = this.gatherGreens();
        const yellows = this.gatherYellows();
        const grays = this.gatherGrays();

        const solver = new Solver(greens, yellows, grays);
        
        return solver.filter(words);
    }
}

