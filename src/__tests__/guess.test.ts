import { test, describe, expect } from 'vitest';
import { Guess, Letter, Hint } from '@/guess';

// Note: We're avoiding testing the solver directly
// Also, will only check general values (bits, reduction, etc) in case word list changes more.

describe('Guess', () => {
    test("single Guess", () => {
        const guess = new Guess("stone", 0, "snout");

        expect(guess.word).toBe("stone");
        expect(guess.answer).toBe("snout");
        expect(guess.isCorrect).toBeFalsy;

        expect(guess.letters.map((l) => l.letter)).toEqual(["s", "t", "o", "n", "e"]);
        expect(guess.letters.map((l) => l.hint)).toEqual([Hint.Correct, Hint.Present, Hint.Correct, Hint.Present, Hint.Absent]);

        // Being the first guess, the Uncertainty is very high
        expect(guess.uncertainty).greaterThan(13).lessThan(14);
        
        // This guess is very good, which means it's very improbable
        expect(guess.probability).greaterThan(0.0003).lessThan(0.001);
        
        // This should halve the list at least 11 times.
        expect(guess.bits).greaterThan(11).lessThan(12);

        // This is a very good grade
        expect(guess.grade).greaterThan(.9);
        
        // Each letter should only ever reduce the possible words remaining (in resolution order)
        expect(guess.resolvedLetters[0].wordsRemaining.length).toBeGreaterThanOrEqual(guess.resolvedLetters[1].wordsRemaining.length);
        expect(guess.resolvedLetters[1].wordsRemaining.length).toBeGreaterThanOrEqual(guess.resolvedLetters[2].wordsRemaining.length);
        expect(guess.resolvedLetters[2].wordsRemaining.length).toBeGreaterThanOrEqual(guess.resolvedLetters[3].wordsRemaining.length);
        expect(guess.resolvedLetters[3].wordsRemaining.length).toBeGreaterThanOrEqual(guess.resolvedLetters[4].wordsRemaining.length);

        // The bits of each letter should add up to the bits of the guess
        expect(guess.letters.map(l => l.bits).reduce((acc, n) => acc + n)).toEqual(guess.bits);

    });

    test("multiple Guesses", () => {
        const answer = "shall";

        // First guess is not great
        const guess1 = new Guess("found", 0, answer);
        expect(guess1.isCorrect).toBe(false);
        expect(guess1.letters.map(l => l.hint)).toEqual([Hint.Absent, Hint.Absent, Hint.Absent, Hint.Absent, Hint.Absent]);
        expect(guess1.uncertainty).greaterThanOrEqual(13).lessThanOrEqual(14);
        expect(guess1.bits).greaterThanOrEqual(1.5).lessThanOrEqual(2);
        expect(guess1.grade).greaterThanOrEqual(.2).lessThanOrEqual(.3);

        // Second guess is better, but still not great
        const guess2 = new Guess("heart", 1, answer, guess1);
        expect(guess2.isCorrect).toBe(false);
        expect(guess2.letters.map(l => l.hint)).toEqual([Hint.Present, Hint.Absent, Hint.Correct, Hint.Absent, Hint.Absent]);
        expect(guess2.uncertainty).greaterThanOrEqual(11).lessThanOrEqual(12.5);
        expect(guess2.uncertainty).toBeCloseTo(guess1.uncertainty - guess1.bits);
        expect(guess2.bits).greaterThanOrEqual(6).lessThanOrEqual(7);
        expect(guess2.grade).greaterThanOrEqual(.7).lessThanOrEqual(.8);

        // Getting warmer
        const guess3 = new Guess("clash", 2, answer, guess2);
        expect(guess3.isCorrect).toBe(false);
        expect(guess3.letters.map(l => l.hint)).toEqual([Hint.Absent, Hint.Present, Hint.Correct, Hint.Present, Hint.Present]);
        expect(guess3.uncertainty).greaterThanOrEqual(5).lessThanOrEqual(6);
        expect(guess3.uncertainty).toBeCloseTo(guess2.uncertainty - guess2.bits);
        expect(guess3.bits).greaterThanOrEqual(3).lessThanOrEqual(4);
        expect(guess3.grade).greaterThanOrEqual(.8).lessThanOrEqual(.9);

        // Guess 4 is almost correct
        const guess4 = new Guess("shawl", 3, answer, guess3);
        expect(guess4.isCorrect).toBe(false);
        expect(guess4.letters.map(l => l.hint)).toEqual([Hint.Correct, Hint.Correct, Hint.Correct, Hint.Absent, Hint.Correct]);
        expect(guess4.uncertainty).greaterThanOrEqual(1).lessThanOrEqual(3);
        expect(guess4.uncertainty).toBeCloseTo(guess3.uncertainty - guess3.bits);
        expect(guess4.bits).greaterThanOrEqual(1).lessThanOrEqual(3);
        expect(guess4.grade).greaterThanOrEqual(.9);
        
        // Guess 5 is correct, so none of the calculations matter, and mostly return zeroes
        const guess5 = new Guess("shall", 4, answer, guess4);
        expect(guess5.isCorrect).toBe(true);
        expect(guess5.grade).toEqual(1);
    })

    test("double letters only first Present is hinted", () => {
        const guess = new Guess("worry", 0, "renew");

        expect(guess.letters[2].hint).toEqual(Hint.Present);
        expect(guess.letters[3].hint).toEqual(Hint.Absent);
    });

    test("double letters only Correct is hinted", () => {
        const guess = new Guess("niner", 0, "renew");

        expect(guess.letters[0].hint).toEqual(Hint.Absent);
        expect(guess.letters[2].hint).toEqual(Hint.Correct);
    });

    test("double letters Present both are hinted", () => {
        const guess = new Guess("event", 0, "renew");

        expect(guess.letters[0].hint).toEqual(Hint.Present);
        expect(guess.letters[2].hint).toEqual(Hint.Present);
    });

    test("double letters Present and Correct are hinted", () => {
        const guess = new Guess("enter", 0, "renew");

        expect(guess.letters[0].hint).toEqual(Hint.Present);
        expect(guess.letters[3].hint).toEqual(Hint.Correct);
    });

    test("each letter accumulates from previous", () => {
        const guess = new Guess("worry", 0, "renew");
        expect(guess.isCorrect).toBe(false);
        expect(guess.letters.map(l => l.hint)).toEqual([Hint.Present, Hint.Absent, Hint.Present, Hint.Absent, Hint.Absent]);
        expect(guess.bits).greaterThanOrEqual(1).lessThanOrEqual(13);

        // expect(guess.uncertainty).greaterThanOrEqual(1).lessThanOrEqual(3);
        // expect(guess.uncertainty).toBeCloseTo(guess3.uncertainty - guess3.bits);
        // expect(guess.bits).greaterThanOrEqual(1).lessThanOrEqual(3);
        // expect(guess.grade).greaterThanOrEqual(.9);

    });

    test("yellow turns to green after gray", () => {
        const answer = "shawl";
        // woman, await
        const guess1 = new Guess("woman", 0, answer);
        const guess2 = new Guess("await", 0, answer);
        expect(guess2.wordsRemaining.length).greaterThan(0);

    });
})
