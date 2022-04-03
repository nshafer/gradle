Miscellaneous:
- Create cron to check wordlists from NYT, alert if there is a change
- Create bot?
- Animations
- Hand written grades
- Optimize solver for null green, yellow, gray lists, perhaps avoid creating regex completely.
- Maybe support other grading systems, e.g. Japan (S, A, B, C, F)
- Detect hard mode. Give bonus for hard mode?

Gradle:

Main interface:
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

Share:
#Wordle266 Mar 12 3/6*

Grade: A-

⬜🟩🟨🟨⬜ B-
⬜🟩⬜🟩🟨 A
🟩🟩🟩🟩🟩 C-

https://gradle.app/#akdjfslkdjlk23kj4l23k


## New grading based on Information theory

https://www.desmos.com/calculator/wgagodxuym

