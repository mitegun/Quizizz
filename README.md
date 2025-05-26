# Quizizz Auto-Answer Viewer

This project is a browser-based JavaScript tool designed to fetch and display correct answers for Quizizz quizzes. It uses a third-party API to retrieve quiz data and highlights correct answers in real-time while you're viewing the quiz.

## Features

- Prompt for quiz code and fetch answer data via API
- Display all questions and their correct answers in the browser console
- Monitor the currently displayed question and highlight the correct answer on screen
- Supports multiple-choice (MCQ) and fill-in-the-blank (BLANK) questions
- Lightweight and fully client-side, no dependencies

## How It Works

1. When the script runs, it asks for a quiz code.
2. It sends a POST request to `https://v3.schoolcheats.net/quizizz/answers` with that code.
3. It receives the full set of quiz questions and answers in JSON format.
4. All answers are cleaned and printed to the console in a table.
5. Every second, it scans the current question on screen and, if matched, highlights the correct answer in the interface.

## Usage

1. Open your browser's developer console on a Quizizz quiz page.
2. Paste the entire script.
3. When prompted, enter the quiz code.
4. Correct answers will be printed in the console and highlighted on the screen.


On screen: the correct option is visually highlighted for the current question.

## Limitations

- Only supports MCQ and BLANK type questions.
- Dependent on the structure of the Quizizz DOM – future updates may break compatibility.
- Relies on a third-party API that may become unavailable or change behavior.

## Disclaimer

This tool is intended for educational and research purposes only. It is not affiliated with Quizizz and may violate their terms of service. Use responsibly and with permission.



