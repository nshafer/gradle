# Gradle

Grade your wordle games. Analyze game play. Save history. Share easily.

## Features

- Select any date to enter your wordle guesses for that day, or enter a word manually. Defaults to today.
- Each guess will be graded using information theory, giving you objective insight into exactly how each letter contributed to solving the puzzle.
- A final grade will be tallied by averaging all of the individual grades.
- Share your puzzle and grade easily, including a unique link to your specific guesses.
- Include spoiler tags for Discord, Reddit, or Markdown-based forums.
- Supports old and new reddit formatting.
- Your puzzles are saved every day (on your device), and can be viewed in the History page.
- Dark mode and Color-blind mode.
- Auto detects hard-mode.
- Desktop and mobile friendly.
- Can be installed as a Progressive Web App (PWA) to your Homescreen. Works offline.
- Fast solver (usually 1-2 milliseconds).
- Open source.

## Motivation

This is a simple project to help me learn some new tech... TypeScript, Vite, Vue 3 (and declaritive syntax), PWAs, etc.
Use at your own risk.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
make dev
```

### Type-Check and lint

```sh
make check
```

### Compile and Minify for Production

```sh
make build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
make test
```

