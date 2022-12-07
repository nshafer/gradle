import Solver from "./solver";
import type { LetterArray } from './solver';
import { allowedWords } from "./words";
import { letterGrade, letterGradeSimple } from "./game";

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

    get previousWordsRemaining(): string[] {
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
        return letterGradeSimple(this.grade);
    }
}

export class Guess extends Calculable {
    id: number;
    word: string;
    index: number;
    answer: string;
    previous?: Guess;
    hardMode: boolean;
    
    letters: Letter[] = [];
    resolvedLetters: Letter[] = [];

    constructor(word: string, index: number, answer: string, previous?: Guess) {
        super();

        this.id = generateId();
        this.word = word;
        this.index = index;
        this.answer = answer;
        this.previous = previous;
        
        // Calculate the hint colors based on this word versus the given answer
        this.splitWord();
        this.calculateHints();
        this.calculateResolvedLetters();
        
        this.hardMode = this.calculateHardMode();

        this.solve();
    }

    get number(): number {
        return this.index + 1;
    }

    get allPrevious(): Guess[] {
        if (this.previous) {
            return [...this.previous.allPrevious, this.previous];
        } else {
            return [];
        }
    }

    get allGuesses(): Guess[] {
        return [...this.allPrevious, this];
    }

    get isComplete(): boolean {
        return this.index >= 5 || this.isCorrect;
    }

    get isBusted(): boolean {
        return this.index >= 5 && !this.isCorrect;
    }
    
    get isCorrect(): boolean {
        return this.word == this.answer;
    }
    
    get isFirst(): boolean {
        return this.previous == null;
    }

    calculateHardMode() {
        // If this is the first guess, then hard mode is assumed
        if (this.previous == null) {
            return true;
        }

        // If the previous guess wasn't hard mode, then we don't even need to calulate this guess.
        if (this.previous.hardMode == false) {
            // console.debug(`calculateHardMode: prevous guess is not hardmode, returning false`);
            return false;
        }

        // Check if any greens were not reused in the same position.
        for (let i = 0; i < this.previous.letters.length; i++) {
            if (this.previous.letters[i].hint == Hint.Correct && this.letters[i].hint != Hint.Correct) {
                // console.debug(`calculateHardMode: Correct hint at ${i} not preserved`);
                return false;
            }
        }

        // Gather all of the Present letters from the previous guess and make sure they're Present or Correct
        const previousLetters = this.previous.letters.filter(l => l.hint == Hint.Present).map(l => l.letter);
        const presentLetters = this.letters.filter(l => l.hint == Hint.Correct || l.hint == Hint.Present).map(l => l.letter);

        // Now for each present letter in the previous guess, make sure it's in presentLetters, removing it as we go
        for (let letter of previousLetters) {
            const idx = presentLetters.indexOf(letter);
            if (idx == -1) {
                // console.debug(`calculateHardMode: Present hint ${letter} not found in ${presentLetters}`);
                return false;
            } else {
                presentLetters.splice(idx, 1);
            }
        }

        // If everything passed, then this is hard mode
        return true;
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
                remainingLetters[i] = "_";
            }
        }

        // For all hints that are still gray, determine if they are present elsewhere
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i].hint == Hint.Absent && remainingLetters.indexOf(this.letters[i].letter) != -1) {
                this.letters[i].hint = Hint.Present;
                remainingLetters[remainingLetters.indexOf(this.letters[i].letter)] = "_";
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

        // Solve each letter in resolution order. The last letter's words/answers remaining will
        // be this whole guess's words/answers remaining.
        for (let letter of this.resolvedLetters) {
            this.wordsRemaining = letter.wordsRemaining = letter.solve(this.wordsRemaining);
        }
        
        console.timeEnd("solve");
    }

    get previousWordsRemaining() {
        if (this.previous) {
            return this.previous.wordsRemaining;
        } else {
            return allowedWords;
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

    get finalGrade(): number {
        // Average of all guess grades
        let sum = 0;

        for (let guess of this.allGuesses) {
            sum += guess.grade;
        }

        // Add 100 per unused guess
        sum += (6 - this.number) * 1;

        return sum / 6;
    }

    get finalLetterGrade(): string {
        return letterGrade(this.finalGrade);
    }

    get finalLetterGradeSimple(): string {
        return letterGradeSimple(this.finalGrade);
    }

    get unicodeHints(): string {
        return this.letters.map((letter) => letter.unicodeHint).join("");
    }
    
    get unicodeHintsDark(): string {
        return this.letters.map((letter) => letter.unicodeHintDark).join("");
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

    gatherLetters(hint: Hint): LetterArray {
        let letters: LetterArray;
        if (this.previousLetter) {
            letters = this.previousLetter.gatherLetters(hint);
        } else {
            letters = new Array(5).fill(null);
        }

        if (this.hint == hint) {
            letters[this.index] = this.letter;
        }
        
        return letters;
    }

    solve(words: string[]): string[] {
        const correct = this.gatherLetters(Hint.Correct);
        const present = this.gatherLetters(Hint.Present);
        const absent = this.gatherLetters(Hint.Absent);

        const solver = new Solver(correct, present, absent);
        
        return solver.filter(words);
    }

    get unicodeHint(): string {
        switch (this.hint) {
            case Hint.Correct:
                return "🟩";
            case Hint.Present:
                return "🟨";
            case Hint.Absent:
                return "⬜";
            default:
                return "⬜";
        }
    }

    get unicodeHintDark(): string {
        switch (this.hint) {
            case Hint.Correct:
                return "🟩";
            case Hint.Present:
                return "🟨";
            case Hint.Absent:
                return "⬛";
            default:
                return "⬛";
        }
    }
}

