# Todo
- [ ] Create cron to check wordlists from NYT, alert if there is a change
- [ ] Create bot?
- [ ] Animations
- [ ] Hand written grades
- [x] Optimize solver for null green, yellow, gray lists, perhaps avoid creating regex completely.
- [ ] Maybe support other grading systems, e.g. Japan (S, A, B, C, F)
- [x] Detect hard mode. Give bonus for hard mode?
- [x] Detect bust, show x/6
- [x] Support light/dark mode for share glyphs
- [ ] Store results in localStorage, load on date select.
- [ ] OCR image upload


# Main interface
- Input page (left):
    - Select day or enter answer
    - Prompt for guesses one by one:
        - Enter word in standard input type=text
        - Once word is entered, show remaining words and overall score
        - The summary line will be selectable, and clickable to the summary page
    - Share button
        - Use web share API
        - Maybe include option to include guesses, with spoiler tags for reddit, discord.
        - Include link to self with input state in hash, base64'd

- Summary page (right):
    - Show word with hints
    - Show uncertainty, bits, reduction, overall letter grade
    - Show same details of each letter
    - Include buttons for viewing word (and answer?) lists
    - Hint (random word to try next)

- Word filter modal
    - Allow entering letters in each position
    - Shows a list of all possible words that match that filter
    - Toggle to show only possible answers

# Original wordle share

Correct: 🟩
Present: 🟨
Absent: ⬜
Absent (dark): ⬛

Wordle 361 5/6*

⬛⬛🟨⬛⬛
⬛🟨🟨⬛⬛
⬛⬛🟨🟨🟨
🟨🟨⬛🟨🟩
🟩🟩🟩🟩🟩

# Gradle Share

#Wordle266 3/6* B+

⬛⬛🟨⬛⬛ F
⬛🟨🟨⬛⬛ C
⬛⬛🟨🟨🟨 B+
🟨🟨⬛🟨🟩 A+
🟩🟩🟩🟩🟩 A+
🟩🟩🟩🟩🟩 A+

https://gradle.app/#aFSMi7rhIbb0ziXJgxR8udbgxRikqd


## New grading based on Information theory

https://www.desmos.com/calculator/wgagodxuym

# Share codes
    
    version: 4 bits; 0-15; 0 = date-based, 1 = manual-word based
    letter: 5 bits; 0-31; a=0, b=1, y=24, z=25
    word: 5 letters; 25 bits
    date: 16 bits; 0-65535; n days since wordle epoch, allows 179.5 years
    puzzle: Up to 6 words; 150 bits
    total: 4+25+(25*6)

Share code for a date-based puzzle

    000000000001010001010000001111011110101100100
    0000                                                                                     ver; 4 bits (0=date)
        0000000101000101                                                                     date; 16 bits (325)
                        00000                                                                a; 5 bits
                             01111                                                           p; 5 bits
                                  01111                                                      p; 5 bits
                                       01011                                                 l; 5 bits
                                            00100                                            e; 5 bits



This bit packed data is then base62 encoded using characters 0-9, a-z, A-Z


Notes:
v1s = "000000000001010001010000001111011110101100100"
v1r = v1s.split("").reverse().join("")
v1 = parseInt(v1r, 2)

function shift(num, amt) {
    return Math.floor(num * Math.pow(2, amt))
}

ver = v1 & 0b1111
v1 = shift(v1, -4)

date = v1 & 0b1111111111111111
v1 = shift(v1, -16)



https://github.com/peterolson/BigInteger.js#readme



https://localhost:3000/#32hywXxOD96wQR
http://localhost:3000/#70YjoBYnDUTfqmf8mT
http://localhost:3000/#6TyzuuFNJt6ri2bmVw
http://localhost:3000/#SKWEAuTXgKQXfkHx


366;craneadieuknowsuntillastsinput
alcyJqoYyMPn3r41VPjPCr6eOg46L
