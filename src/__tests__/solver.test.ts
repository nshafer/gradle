import { test, describe, expect } from 'vitest';
import { words, answers, allWords } from '@/words';
import Solver from '@/solver';

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
        words = new Solver("_r___", "__ees", "t____").filter(allWords);
        expect(words.length).toBe(2);
        expect(words.includes("trees")).toBe(false);
        expect(words.includes("great")).toBe(false);
        expect(words.includes("naval")).toBe(false);
        expect(words.includes("sneer")).toBe(false);
        
        // cease
        words = new Solver("__ase", "_e___", "c____").filter(allWords);
        expect(words.length).toBe(1);
        expect(words.includes("crease")).toBe(false);
        expect(words).toEqual(["erase"]);

        // touch
        words = new Solver("_____", "_____", "touch").filter(allWords);
        expect(words.length).greaterThan(4000);
        expect(words.includes("touch")).toBe(false);
        expect(words.filter(w => w.includes('t')).length).toBe(0);
        expect(words.filter(w => w.includes('o')).length).toBe(0);
        expect(words.filter(w => w.includes('u')).length).toBe(0);
        expect(words.filter(w => w.includes('c')).length).toBe(0);
        expect(words.filter(w => w.includes('h')).length).toBe(0);
    })

    test("robot", () => {
        let words;

        // troop motor
        words = new Solver("___o_", "tro__", "____p").filter(allWords);
        expect(words.length).toBe(6);
        // expect(words).toEqual(["robot"])

        // motor
        words = new Solver("_o_o_", "__t_r", "m____").filter(words);
        expect(words.length).toBe(1);
        expect(words).toEqual(["robot"]);
    })

    // test("robot 3", () => {
    //     const words = new Solver("_____", "b,,t,,", "acdefghijklmnpqsuvwxyz").filter(answers);
    //     expect(words.length).toBe(1);
    //     expect(words).toEqual(["robot"])
    // })

    // test("wince 1", () => {
    //     let words;
    //     // candy
    //     words = new Solver("__n__", "c,,,,", "ady").filter(answers);
    //     expect(words.length).toBe(20);
    //     // pinch
    //     words = new Solver("_inc_", "c,,,,", "adyph").filter(answers);
    //     expect(words.length).toBe(3);
    //     // since
    //     words = new Solver("_ince", "c,,,,", "adyphs").filter(answers);
    //     expect(words.length).toBe(2);
    //     // mince
    //     words = new Solver("_ince", "c,,,,", "adyphsm").filter(answers);
    //     expect(words.length).toBe(1);
    //     expect(words).toEqual(["wince"])
    //     words = new Solver("wince", "c,,,,", "adyphsm").filter(answers);
    //     expect(words.length).toBe(1);
    //     expect(words).toEqual(["wince"])
    // })

    // test("knoll 1", () => {
    //     let words;
    //     // rents
    //     words = new Solver("_____", ",,n,,", "rets").filter(answers);
    //     expect(words.length).toBe(79);
    //     // blind
    //     words = new Solver("_____", ",l,n,n,", "retsbid").filter(answers);
    //     expect(words.length).toBe(4);
    //     // naval
    //     words = new Solver("____l", "n,l,n,n,", "retsbidav").filter(answers);
    //     expect(words.length).toBe(1);
    //     expect(words).toEqual(["knoll"])
    // })
})
