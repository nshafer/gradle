- Create cron to check wordlists from NYT, alert if there is a change
- Create bot?

Skordle:

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

- Result page (right):
    - Reduction summary
        - Show how many answers are left after this guess. 
        - Show how many words this guess eliminated.
        - Show reduction part of the score (x/10)
    - Color points summary
        - Show 1 point per green, half point per yellow.
        - Show total score for this guess.
    - Buttons:
        - Show remaining words
        - Show remaining answers (maybe?)
        - Hint (random word to try next)

- Word filter modal
    - Allow entering letters in each position
    - Shows a list of all possible words that match that filter
    - Toggle to show only possible answers

Score per guess:
- Two parts.
    - 50% based on reduction of word list: (((start_num - end_num) / start_num) ^ 10)
    - 50% based on greens and yellows found. 1 point per green, half point per yellow
- This gives a final score from 0-10

Final score
- For every guess that is not correct, score based above.
- For every guess not needed: 10 points.
- Sum all guesses. Max possible is 60 for guessing the answer in the first guess. So scale of x/60.


Share:
Wordle 266 Mar 12 3/6*

⬜🟩🟨🟨⬜ 6.7/10
⬜🟩⬜🟩🟨 7.8/10
🟩🟩🟩🟩🟩 10/10
Score: 54.5/60
https://wordle-helper.app/#akdjfslkdjlk23kj4l23k


Wordle 266 3/6

⬜🟩🟨🟨⬜
⬜🟩⬜🟩🟨
🟩🟩🟩🟩🟩

Reddit:
Scoredle 266 3/6*  

12,947  
⬜🟩🟨🟨⬜ >!ROADS!< (25)  
⬜🟩⬜🟩🟨 >!NOMAD!< (3)  
🟩🟩🟩🟩🟩 >!TODAY!<

Discord:
Scoredle 266 3/6*

12,947
⬜🟩🟨🟨⬜ ||ROADS|| (25)
⬜🟩⬜🟩🟨 ||NOMAD|| (3)
🟩🟩🟩🟩🟩 ||TODAY||
