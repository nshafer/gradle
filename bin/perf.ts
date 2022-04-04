#!/usr/bin/env ts-node

import { Guess } from "../src/guess";

console.time("shall");

for (let i = 0; i < 1000; i++) {
    const answer = "shall";
    const guess1 = new Guess("found", 0, answer);
    const guess2 = new Guess("heart", 1, answer, guess1);
    const guess3 = new Guess("clash", 1, answer, guess2);
    const guess4 = new Guess("shawl", 1, answer, guess3);
    const guess5 = new Guess("shall", 1, answer, guess4);
}

console.timeEnd("shall");
