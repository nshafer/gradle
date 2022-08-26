import { test, describe, expect } from 'vitest';
import { encodeShareCode, decodeShareCode } from '@/encoding';

test("version 0", () => {
    let shareCode = encodeShareCode(["apple"]);
    expect(shareCode.length).toBeGreaterThan(0);
    
    let shareData = decodeShareCode(encodeShareCode([]));
    expect(shareData.words).toEqual([]);
    expect(shareData.answer).toEqual("");
    
    shareData = decodeShareCode(encodeShareCode(["apple"]));
    expect(shareData.words).toEqual(["apple"]);
    expect(shareData.answer).toEqual("apple");
    
    shareData = decodeShareCode(encodeShareCode(["apple", "crane", "adieu", "false", "truth", "plane"]));
    expect(shareData.words).toEqual(["apple", "crane", "adieu", "false", "truth", "plane"]);
    expect(shareData.answer).toEqual("plane");
});

test("version 1", () => {
    const d = new Date(2022, 5, 15)

    let shareCode = encodeShareCode(["apple"], d);
    expect(shareCode.length).toBeGreaterThan(0);
    
    let shareData = decodeShareCode(encodeShareCode([], d));
    expect(shareData.words).toEqual([]);
    expect(shareData.date).toEqual(d);
    expect(shareData.answer).toEqual("");
    
    shareData = decodeShareCode(encodeShareCode(["apple"], d));
    expect(shareData.words).toEqual(["apple"]);
    expect(shareData.date).toEqual(d);
    expect(shareData.answer).toEqual("apple");

    shareData = decodeShareCode(encodeShareCode(["apple", "crane", "adieu", "false", "truth", "plane"], d));
    expect(shareData.words).toEqual(["apple", "crane", "adieu", "false", "truth", "plane"]);
    expect(shareData.date).toEqual(d);
    expect(shareData.answer).toEqual("plane");
});
