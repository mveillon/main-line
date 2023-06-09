# Main Line

This app uses Stockfish.wasm from Lichess. To install the dependencies, you first need to download and install [enscripten](https://emscripten.org/docs/getting_started/downloads.html). You can put the enscripten folder anywhere on your computer, but anytime you compile Stockfish, you have to run `source <path to /emsdk/emsdk_env.sh>`. It resets when you open a new Terminal window, so be sure to rerun it when you need to. Once you've run that, clone [the Stockfish repo](https://github.com/lichess-org/stockfish.wasm) and put it in the `public` directory. `cd` into the `stockfish.wasm` directory and run `npm run-script prepare` to compile Stockfish. `cd` back into the `chess-openings` root directory and run `npm i` (and pray it works because this whole thing is such a dang mess). From there, you can run any of the scripts below from the root directory.

# Scripts

## npm start
This will start the development React server and open it in a new tab in your preferred browser.

## npm build
This will create the production bundle and place it in the `build` directory.

## npm test
This will run all of the unit tests in `src/tests/`. They will run in `watcher` mode.

## npm eject
This does some weird stuff with the `craco` and `react-scripts` configurations. This cannot be undone. Don't run this command.

## npm run test-coverage
This runs all the unit tests outside of `watcher` mode and generates a coverage report.

## npm run gen-puzzles
This will generate puzzles and analyze every possible move the player can play for all puzzles in `PGNs.ts`. New puzzles can be added or commented out to this file as needed.

