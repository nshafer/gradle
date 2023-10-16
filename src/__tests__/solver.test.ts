import { test, describe, expect, beforeAll } from 'vitest';
import { allowedWords } from '@/words';
import { answers } from '@/answers';
import { mockAnswers } from './mock_answers';
import Solver from '@/solver';

beforeAll(async () => {
    answers.list = mockAnswers;
});

describe('Solver instantiation', () => {
    test("expected input", () => {
        const s = new Solver(['a', null, null, null, null], [null, 'u', null, 't', null], [null, null, 's', null, 'm', null]);
        expect(s).toBeInstanceOf(Solver);
        expect(s.correct).toEqual(['a', null, null, null, null]);
        expect(s.present).toEqual([null, 'u', null, 't', null]);
        expect(s.absent).toEqual([null, null, 's', null, 'm']);
    });

    test("string inputs", () => {
        const s = new Solver("_u__e", "_b__t", "acd__");
        expect(s).toBeInstanceOf(Solver);
        expect(s.correct).toEqual([null, 'u', null, null, 'e']);
        expect(s.present).toEqual([null, 'b', null, null, 't']);
        expect(s.absent).toEqual(['a', 'c', 'd', null, null]);
    });
})

describe('Solve.solve', () => {
    test("erase", () => {
        let words;

        // trees
        words = new Solver("_r___", "__ees", "t____").filter(allowedWords);
        expect(words.length).toBe(2);
        expect(words.includes("trees")).toBe(false);
        expect(words.includes("great")).toBe(false);
        expect(words.includes("naval")).toBe(false);
        expect(words.includes("sneer")).toBe(false);
        
        // cease
        words = new Solver("__ase", "_e___", "c____").filter(allowedWords);
        expect(words.length).toBe(1);
        expect(words.includes("crease")).toBe(false);
        expect(words).toEqual(["erase"]);

        // touch
        words = new Solver("_____", "_____", "touch").filter(allowedWords);
        expect(words.length).greaterThan(4000);
        expect(words.includes("touch")).toBe(false);
        expect(words.filter(w => w.includes('t')).length).toBe(0);
        expect(words.filter(w => w.includes('o')).length).toBe(0);
        expect(words.filter(w => w.includes('u')).length).toBe(0);
        expect(words.filter(w => w.includes('c')).length).toBe(0);
        expect(words.filter(w => w.includes('h')).length).toBe(0);
    })

    test("troop -> motor -> robot", () => {
        let words;

        // troop
        words = new Solver("___o_", "tro__", "____p").filter(allowedWords);
        expect(words).not.toContain("troop");
        expect(words).toContain("robot");

        // motor
        words = new Solver("_o_o_", "__t_r", "m____").filter(words);
        expect(words.length).toBe(1);
        expect(words).not.toContain("motor");
        expect(words).toEqual(["robot"])

        // robot
        words = new Solver("robot", "_____", "_____").filter(words);
        expect(words.length).toBe(1);
        expect(words).toEqual(["robot"]);
    });

    test("outer -> enter -> inter", () => {
        let words;

        // outer
        words = new Solver("__ter", "_____", "ou___").filter(allowedWords);
        expect(words).not.toContain("outer");
        expect(words).toContain("enter");
        expect(words).toContain("inter");
        
        // enter
        words = new Solver("_nter", "_____", "e____").filter(words);
        expect(words.length).toBe(1);
        expect(words).not.toContain("enter");
        expect(words).toEqual(["inter"]);
    });

    test("inter -> scowl -> woody -> whoop", () => {
        let words;

        // inter
        words = new Solver("_____", "_____", "inter").filter(allowedWords);
        expect(words).not.toContain("inter");
        expect(words).toContain("whoop");

        // scowl
        words = new Solver("__o__", "___w_", "sc__l").filter(words);
        expect(words).not.toContain("scowl");
        expect(words).toContain("whoop");

        // woody
        words = new Solver("w_o__", "_o___", "___dy").filter(words);
        expect(words).not.toContain("woody");
        expect(words).toContain("whoop");
        expect(words).toContain("whoof");

        // whoop
        words = new Solver("whoop", "_____", "_____").filter(words);
        expect(words).toEqual(["whoop"]);
    });

    test("boots -> about", () => {
        let words;

        // boots
        words = new Solver("__o__", "b__t_", "_o__s").filter(allowedWords);
        expect(words).not.toContain("boots");
        expect(words).toEqual(["abort", "about"]);
    });

    test("second gray letter eliminates double letter answers", () => {
        let words;

        // vapid
        words = new Solver("_____", "_____", "vapid").filter(allowedWords);
        expect(words).toContain("enemy")
        expect(words).toContain("enjoy")

        // ended
        words = new Solver("en___", "_____", "__ded").filter(words);
        expect(words).not.toContain("enemy");
    });
})
