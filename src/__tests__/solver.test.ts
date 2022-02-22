import { test, describe, expect } from 'vitest';
import Solver from '@/solver';

describe('Solver instantiation', () => {
    test("expected input", () => {
        const s = new Solver(['a', null, null, null, null], [ ['a', 'b'], [], [], ['c'], [] ], ['g', 'h', 'i']);
        expect(s).toBeInstanceOf(Solver);
        expect(s.greens).toEqual(['a', null, null, null, null]);
        expect(s.yellows).toEqual([['a', 'b'], [], [], ['c'], []]);
        expect(s.grays).toEqual(['g', 'h', 'i']);
    });

    test("string inputs", () => {
        const s = new Solver("_u__e", ",be,,,t", "acd");
        expect(s).toBeInstanceOf(Solver);
        expect(s.greens).toEqual([null, 'u', null, null, 'e']);
        expect(s.yellows).toEqual([ [], ['b', 'e'], [], [], ['t'] ]);
        expect(s.grays).toEqual(['a', 'c', 'd']);
    });
})

describe('Solve.solve', () => {
    test("robot 1", () => {
        let words;
        words = new Solver("ro___", "t,,ro,t,", "eupasl").solve();
        expect(words.length).toBe(2);
        words = new Solver("ro_o_", "t,,rot,t,", "eupasl").solve();
        expect(words.length).toBe(1);
        expect(words).toEqual(["robot"])
    })

    test("robot 2", () => {
        const words = new Solver("_____", "o,,ort,r,", "eyuipasdlcvn").solve();
        expect(words.length).toBe(1);
        expect(words).toEqual(["robot"])
    })

    test("robot 3", () => {
        const words = new Solver("_____", "b,,t,,", "acdefghijklmnpqsuvwxyz").solve();
        expect(words.length).toBe(1);
        expect(words).toEqual(["robot"])
    })

    test("wince 1", () => {
        let words;
        // candy
        words = new Solver("__n__", "c,,,,", "ady").solve();
        expect(words.length).toBe(20);
        // pinch
        words = new Solver("_inc_", "c,,,,", "adyph").solve();
        expect(words.length).toBe(3);
        // since
        words = new Solver("_ince", "c,,,,", "adyphs").solve();
        expect(words.length).toBe(2);
        // mince
        words = new Solver("_ince", "c,,,,", "adyphsm").solve();
        expect(words.length).toBe(1);
        expect(words).toEqual(["wince"])
        words = new Solver("wince", "c,,,,", "adyphsm").solve();
        expect(words.length).toBe(1);
        expect(words).toEqual(["wince"])
    })

    test("knoll 1", () => {
        let words;
        // rents
        words = new Solver("_____", ",,n,,", "rets").solve();
        expect(words.length).toBe(79);
        // blind
        words = new Solver("_____", ",l,n,n,", "retsbid").solve();
        expect(words.length).toBe(4);
        // naval
        words = new Solver("____l", "n,l,n,n,", "retsbidav").solve();
        expect(words.length).toBe(1);
        expect(words).toEqual(["knoll"])
    })
})
