import Solver from "./solver";
import { allWords, answers } from "./words";
import { letterGrade } from "./game";

enum Hint {
    Correct = "correct",
    Present = "present",
    Absent = "absent",
}

var id = 0;

function generateId(): number {
    return id++;
}

class Calculable {
    wordsRemaining: string[] = [];
    answersRemaining: string[] = [];

    get previousWordsRemaining(): string[] {
        throw new Error("Not Implemented");
    }

    get previousAnswersRemaining(): string[] {
        throw new Error("Not Implemented");
    }

    get wordReduction() {
        return this.previousWordsRemaining.length - this.wordsRemaining.length;
    }

    get wordReductionPercent(): number {
        return this.wordReduction / this.previousWordsRemaining.length;
    }

    // How many bits of uncertainty there are in the words remaining from the previous guess
    get uncertainty(): number {
        // `-log2(1 / numPrevious)` simplified
        return Math.log2(this.previousWordsRemaining.length);
    }

    // The probability that this guess was the correct one
    get probability(): number {
        return this.wordsRemaining.length / this.previousWordsRemaining.length;
    }

    get bits(): number {
        return Math.log2(1 / this.probability);
    }

    get percentage(): number {
        if (this.bits > 0 && this.uncertainty > 0) {
            return this.bits / this.uncertainty;
        } else {
            return 1;
        }
    }

    get grade(): number {
        return 1 - Math.pow(1 - this.percentage, 2);
    }

    get letterGrade(): string {
        return letterGrade(this.grade);
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

    solve() {
        console.time("solve");

        // Find words and answers remaining for each hint calculated cumulatively.
        this.wordsRemaining = [...this.previousWordsRemaining];
        this.answersRemaining = [...this.previousAnswersRemaining];
        for (let letter of this.letters) {
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
}

export class Letter extends Calculable {
    guess: Guess;
    index: number;
    letter: string;
    hint: Hint = Hint.Absent;

    constructor(guess: Guess, index: number, letter: string) {
        super();

        this.guess = guess;
        this.index = index;
        this.letter = letter;
    }

    get previousLetter(): Letter | null {
        if (this.index > 0) {
            return this.guess.letters[this.index-1];
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
    
    solve(words: string[]): string[] {
        let solver: Solver;
        
        switch (this.hint) {
            case Hint.Correct:
                const greens = new Array(5).fill(null);
                greens[this.index] = this.letter;
                solver = new Solver(greens, new Array(5).fill(null), []);
                break;
        
            case Hint.Present:
                const yellows = new Array(5).fill(null);
                yellows[this.index] = [this.letter];
                solver = new Solver(new Array(5).fill(null), yellows, []);
                break;
        
            case Hint.Absent:
                solver = new Solver(new Array(5).fill(null), new Array(5).fill(null), [this.letter]);
                break;
        
            default:
                throw new Error(`Invalid Hint: ${this.hint}`);
        }

        return solver.filter(words);
    }
}

