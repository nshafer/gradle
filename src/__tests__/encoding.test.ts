import { test, describe, expect } from 'vitest';
import { encodeShareCode, decodeShareCode } from '@/encoding';

test("version 0", () => {
    let shareCode = encodeShareCode(["apple"], "apple");
    expect(shareCode.length).toBeGreaterThan(0);
    
    // One successful guess should result in a share code that can be decoded
    let shareData = decodeShareCode(encodeShareCode(["apple"], "apple"));
    expect(shareData.words).toEqual(["apple"]);
    expect(shareData.answer).toEqual("apple");
    
    // Six guesses with the last guess being right should result in a share code that can be decoded
    shareData = decodeShareCode(encodeShareCode(["apple", "crane", "adieu", "false", "truth", "apple"], "apple"));
    expect(shareData.words).toEqual(["apple", "crane", "adieu", "false", "truth", "apple"]);
    expect(shareData.answer).toEqual("apple");
    
    // Six guesses with a failed last guess should still result in a share code that can be decoded correctly
    shareData = decodeShareCode(encodeShareCode(["apple", "crane", "adieu", "false", "truth", "plane"], "apple"));
    expect(shareData.words).toEqual(["apple", "crane", "adieu", "false", "truth", "plane"]);
    expect(shareData.answer).toEqual("apple");
});

test("version 1", () => {
    // Jan 1st, 2022 the word is "rebus"
    const d = new Date(2022, 0, 1)

    // No guesses should result in a share code that can still be decoded even if that's practically useless
    let shareData = decodeShareCode(encodeShareCode([], d));
    expect(shareData.words).toEqual([]);
    expect(shareData.date).toEqual(d);
    expect(shareData.answer).toEqual("rebus");
    
    // One successful guess should result in a share code that can be decoded
    let shareCode = encodeShareCode(["rebus"], d);
    expect(shareCode.length).toBeGreaterThan(0);
    shareData = decodeShareCode(shareCode);
    expect(shareData.words).toEqual(["rebus"]);
    expect(shareData.date).toEqual(d);
    expect(shareData.answer).toEqual("rebus");

    // Six guesses with the last guess being right should result in a share code that can be decoded
    shareData = decodeShareCode(encodeShareCode(["apple", "crane", "adieu", "false", "truth", "rebus"], d));
    expect(shareData.words).toEqual(["apple", "crane", "adieu", "false", "truth", "rebus"]);
    expect(shareData.answer).toEqual("rebus");

    // Six guesses with a failed last guess should still result in a share code that can be decoded correctly
    shareData = decodeShareCode(encodeShareCode(["apple", "crane", "adieu", "false", "truth", "plane"], d));
    expect(shareData.words).toEqual(["apple", "crane", "adieu", "false", "truth", "plane"]);
    expect(shareData.date).toEqual(d);
    expect(shareData.answer).toEqual("rebus");
});

test("version 0 backwards-compatibility", () => {
    let shareCode = "fEUh8YhcOU1d5zz3eNeuMI";
    let shareData = decodeShareCode(shareCode);
    expect(shareData.words).toEqual(["crate", "adieu", "awoke", "ample", "apple"]);
    expect(shareData.answer).toEqual("apple");
})

test("version 1 backwards-compatibility", () => {
    const d = new Date(2022, 10, 10);
    
    let shareCode = "SLkbmLBDRcObpcLu";
    let shareData = decodeShareCode(shareCode);
    expect(shareData.words).toEqual(["vapid", "ended", "enjoy"]);
    expect(shareData.answer).toEqual("enjoy");

    shareCode = "alh15lqg2VtWdvzQNh5A59VFDJ9Ne";
    shareData = decodeShareCode(shareCode);
    expect(shareData.words).toEqual(["begin", "aloud", "spurt", "munch", "mucky", "muffy"]);
    expect(shareData.answer).toEqual("mummy");
});
