// Guess

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
    
    answers: string[] = [];
    letters: string[];
    hints: Hint[];

    constructor(word: string, index: number, answer: string, previous?: Guess) {
        this.id = generateId();
        this.word = word;
        this.index = index;
        this.answer = answer;
        this.previous = previous;
        this.isCorrect = this.word == this.answer;
        this.letters = word.split("");
        this.hints = this.calculateHints();
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

}
