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
    answers: string[] = [];

    constructor(word: string, index: number, answer: string, previous?: Guess) {
        this.id = generateId();
        this.word = word;
        this.index = index;
        this.answer = answer;
        this.previous = previous;
    }
}
