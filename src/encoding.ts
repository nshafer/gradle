/*

Encode and decode share-codes using custom format. In short, the format is a version and required data needed to
encode the puzzle. A list of guesses is given, and optionally a puzzle date and/or puzzle answer. This is encoded into
the share code, so when decoded it will return the list of guesses, puzzle date and/or answer.

Encoding:
  where:
    version = 4 bits; 0-15; 16 possible versions of share-codes
    data = whatever data this version of the encoding needs

Version 0:
  - assumes the puzzle is complete
  - the last guess is the answer
  - each guess is 5 characters
  - there are between 1 and 6 guesses, inclusive
  - data:
    - version: 4 bits; 0-15; 16 possible versions of share-codes
    - puzzle: up to 6 guesses; 25 - 150bits
    - guess: 5 letters; 25 bits
    - letter: 5 bits; 0-31; a=0, b=1, y=24, z=25
    - total: 4+(25*n) bits; n = number of guesss

Share code for version 0

    00000000001111011110101100100
    0000                           ver; 4 bits
        00000                      a; 5 bits \
             01111                 p; 5 bits  |
                  01111            p; 5 bits  | 25 bits
                       01011       l; 5 bits  |
                            00100  e; 5 bits /

Version 1:
  - assumes the puzzle is complete
  - the last guess is the answer
  - each guess is 5 characters
  - there are between 1 and 6 guesses, inclusive
  - includes the puzzle date as a 16 bit count of days since 2021-06-19
  - data:
    - version: 4 bits; 0-15; 16 possible versions of share-codes
    - date: 16 bits; 0-65535; n days since wordle epoch, allows 179.5 years
    - puzzle: up to 6 guesses; 25 - 150bits
    - guess: 5 letters; 25 bits
    - letter: 5 bits; 0-31; a=0, b=1, y=24, z=25
    - total: 4+16+(25*n) bits; n = number of guesss

Share code for version 1

    000000000001011010010000001111011110101100100
    0000                                           ver; 4 bits
        0000000101101001                           date; 16 bits
                        00000                      a; 5 bits \
                             01111                 p; 5 bits  |
                                  01111            p; 5 bits  | 25 bits
                                       01011       l; 5 bits  |
                                            00100  e; 5 bits /

This bit packed data is then base62 encoded using characters 0-9, a-z, A-Z

*/

import bigInt from "big-integer";
import { dateIndex, getDateByDateIndex } from "./game";

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
// (window as any).letters = alphabet;
const encodingAlphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
// (window as any).alpha = encodingAlphabet;

export interface ShareData {
    words: string[],
    answer: string,
    date?: Date,
}

export function encodeShareCode(guesses: string[], date?: Date, answer?: string): string {
    let binString: string;
    let ver = 0;

    if (date !== undefined) {
        // Convert the guesss to a binstring using version 1 algorithm
        binString = guessesToBinStringVersion1(guesses, date);
        ver = 1;
    } else {
        // Convert the guesses to a binstring using version 0 algorithm
        binString = guessesToBinStringVersion0(guesses);
    }

    // Prepend the version
    binString = verToBinString(ver) + binString;

    // Now encode that with the standard share-code encoder
    const shareCode = binStringToShareCode(binString);
    return shareCode;
}
// (window as any).encodeShareCode = encodeShareCode;

// Decodes a given base62 share-code into a list of guesses depending on the version
export function decodeShareCode(code: string): ShareData {
    try {
        // Convert the code into a binString
        const binString = shareCodeToBinString(code);

        // Get the version from the first four bits
        const ver = binStringToVer(binString.slice(0, 4));
        const data = binString.slice(4);

        // Convert the data to a list of guesses based on the version
        return binStringToShareData(ver, data);
    } catch (error) {
        console.error(`Invalid share-code (${code})`, error);
        return {
            words: [],
            answer: "",
        };
    }
}
// (window as any).decodeShareCode = decodeShareCode;

// Converts a binary string into a Big Integer. Adds padding '1' to beginning so we don't lose significant digits.
function binStringToBigInt(bin: string): bigInt.BigInteger {
    return bigInt("1" + bin, 2);
}

function binStringToShareCode(bin: string): string {
    return binStringToBigInt(bin).toString(encodingAlphabet.length, encodingAlphabet);
}

// Decodes a given base62 share-code into a binary string
function shareCodeToBinString(code: string): string {
    // Convert to big integer
    const num = bigInt(code, encodingAlphabet.length, encodingAlphabet, true);

    // Convert to binary string
    let binString = num.toString(2);

    // Remove padding '1'
    return binString.substring(1);
}

function binStringToShareData(ver: number, data: string): ShareData {
    switch (ver) {
        case 0:
            return binStringToShareData0(data);
        case 1:
            return binStringToShareData1(data);
        default:
            throw new Error("invalid version");
    }
}

// Version 0 algorithm specifics

function guessesToBinStringVersion0(guesses: string[]): string {
    // Encode each guess into its binary representation and join them all together with no spaces
    return guesses.map(guessToBinString).join("");
}

function binStringToShareData0(data: string): ShareData {
    const guesses: string[] = [];

    while (data.length >= 25) {
        // Get the next 5 digits of the binstring
        const binString = data.slice(0, 25);
        data = data.slice(25);

        // convert the binstring to the guess
        guesses.push(binStringToGuess(binString));
    }

    return {
        words: guesses,
        answer: guesses.length > 0 ? guesses[guesses.length-1] : "",
    }
}

// Version 1 algorithm specifics

function guessesToBinStringVersion1(guesses: string[], date: Date): string {
    // Encode the date as a 16 bit integer representing days since wordle epoch
    const day = dateIndex(date);
    if (day < 0 || day > 65535) {
        throw new Error("date must be between 0 and 65535, inclusive");
    }

    const dateBin = day.toString(2).padStart(16, '0')
    
    // Encode each guess into its binary representation and join them all together with no spaces
    const guessBin = guesses.map(guessToBinString).join("");

    return dateBin + guessBin;
}

function binStringToShareData1(data: string): ShareData {
    let date: Date;
    const guesses: string[] = [];
    
    if (data.length >= 16) {
        const dateBin = data.slice(0, 16);
        data = data.slice(16);
        const dateIndex = parseInt(dateBin, 2);
        date = getDateByDateIndex(dateIndex);
    } else {
        throw new Error("invalid share-code");
    }

    while (data.length >= 25) {
        // Get the next 5 digits of the binstring
        const binString = data.slice(0, 25);
        data = data.slice(25);

        // convert the binstring to the guess
        guesses.push(binStringToGuess(binString));
    }

    return {
        words: guesses,
        date: date,
        answer: guesses.length > 0 ? guesses[guesses.length - 1] : "",
    }
}

// Helper functions

function guessToBinString(guess: string): string {
    return guess.split("").map(letterToBinString).join("");
}

function letterToBinString(letter: string) {
    return alphabet.indexOf(letter).toString(2).padStart(5, '0');
}

function binStringToGuess(binString: string): string {
    const letters: string[] = [];

    while (binString.length >= 5) {
        const letterBin = binString.slice(0, 5);
        binString = binString.slice(5);

        letters.push(binStringToLetter(letterBin));
    }

    return letters.join("");
}

function binStringToLetter(binString: string): string {
    return alphabet[parseInt(binString, 2)]
}


function verToBinString(ver: number): string {
    if (ver < 0 || ver > 15) {
        throw new Error("ver must be >= 0, <= 15");
    }
    return ver.toString(2).padStart(4, "0");
}

function binStringToVer(binString: string): number {
    if (binString.length != 4) {
        throw new Error("ver binString must be 4 binary digits long");
    }
    return parseInt(binString, 2);
}
