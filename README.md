# 8-Puzzle Challenge / 詰め8パズル

A web-based 8-puzzle game where the objective is to solve the board in the optimal (minimum) number of moves, similar to a "tsume" (mating/solving) problem.

## Features

- **Optimal Solving Challenge:** You are challenged to solve generated 8-puzzles within the exact minimum number of moves required.
- **Multiple Difficulties:** Supports several difficulty levels (Easy, Medium, Hard, and Random).
- **Bilingual Support:** Interface available in both English and Japanese.
- **Keyboard Controls:** Use Arrow keys to slide tiles, and `Ctrl+Z` (or `Cmd+Z`) to undo moves.
- **Hints & Tools:** "Solve One" (Hint Move), Undo, and Reset functionalities to help you find the optimal solution.

## Getting Started

Since this is a client-side vanilla JavaScript application (using ES Modules), you can simply serve the directory using any static web server.

```bash
# Example using Python 3
python -m http.server 8080
```
Then open `http://localhost:8080/` in your browser.

## Development & Testing

This project uses modern JavaScript features and the native Node.js test runner.

To run the tests:
```bash
npm test
```

## License

See LICENSE.
