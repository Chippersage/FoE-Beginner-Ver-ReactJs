# FoE-Beginner-Ver-ReactJs

This is a FoE-Beginner App designed to make learning fun and interactive. The app provides audio-guided lessons with real-time word highlighting, interactive activities, and a simple yet engaging user interface.

## Features

- **Audio Lessons**: Play audio lessons with word highlighting based on timestamps.
- **Interactive Activities**: Engaging activities at the end of lessons.
- **Navigation Controls**: Easily navigate between lessons with next, previous, and repeat buttons.
- **Mute/Unmute**: Control the audio volume with a mute/unmute toggle.
- **Responsive Design**: The app is designed to be responsive and user-friendly for kids.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Chippersage/FoE-Beginner-Ver-ReactJs
    ```

2. Navigate to the project directory:

    ```bash
    cd FoE-Beginner-Ver-ReactJs
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm start
    ```

The app will be available at `http://localhost:3000`.

## Usage

1. **Start the App**: Once the app is running, click the start button to begin the first lesson.
2. **Navigate Lessons**: Use the next and previous buttons to move through the lessons. You can also repeat a lesson by clicking the repeat button.
3. **Mute/Unmute**: Click the mute/unmute button to control the audio output.
4. **Activities**: After completing all lessons, you can engage in interactive activities to reinforce learning.

## Project Structure

```bash
.
├── public
│   ├── audio
│   │   └── *.mp3
│   └── images
│       └── *.jpg
├── src
│   ├── components
│   │   ├── ActivityPage.js
│   │   ├── AudioPlayer.js
│   │   ├── Header.js
│   │   └── LessonContent.js
│   ├── App.js
│   └── index.js
└── package.json
