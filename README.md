# MP3 Audio Visualizer

This project visualizes MP3 audio input using the Web Audio API and JavaScript. It displays dynamic, colored vertical bars that represent the audio frequencies in real-time.

## How to Run

1.  Clone or download this repository.
2.  Open the `index.html` file in a modern web browser that supports the Web Audio API (e.g., Chrome, Firefox, Safari, Edge).
3.  The visualization will start automatically, playing the default audio file (`from-faraway.mp3`).

## Features

-   **Dynamic Visualization:** Vertical bars change height based on the intensity of different audio frequencies.
-   **Colored Bars:** Bars are colored using an HSL scheme, with hue changing across the frequency spectrum, creating a rainbow effect.
-   **Real-time Processing:** Audio is processed and visualized in real-time using the Web Audio API.

## Technology Used

-   HTML5
-   JavaScript
-   Web Audio API

## Files

-   `index.html`: The main HTML file that hosts the visualizer.
-   `connectAudio.js`: Contains the JavaScript code for audio processing and visualization logic.
-   `*.mp3`, `*.ogg`: Sample audio files.
-   `pitchdetect3.js`: (Currently seems unused in the main visualization but present in the project).
