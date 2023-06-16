# Main Line

This is a web application designed to allow people to learn chess openings by doing, rather than by watching or reading. Users can solve puzzles in positions commonly reached from the opening. 

These puzzles differ from a puzzle you'd typically find in a book or on Chess.com/Lichess in a few ways. Firstly, there are created automatically using Stockfish. As such, there are generally no tactics or crazy checkmates. The puzzles are just about trying to get a better position and not blunder in the opening. Another difference is that most puzzles have many good moves. In the opening, there are typically a few main lines and many sidelines, and this application tries not to discourage any of them.

# Installation

This app uses Stockfish.wasm from Lichess. To install the dependencies, you first need to download and install [enscripten](https://emscripten.org/docs/getting_started/downloads.html). The enscripten folder will be called `emsdk` and will include a file called `emsdk_env.sh`. You can put the enscripten folder anywhere on your computer, but anytime you compile Stockfish, you have to run `source <path to /emsdk/emsdk_env.sh>`. It resets when you open a new Terminal window, so be sure to rerun it when you need to. Once you've run that, clone [the Stockfish repo](https://github.com/lichess-org/stockfish.wasm) and put it in the `public` directory. `cd` into the `stockfish.wasm` directory and run `npm run-script prepare` to compile Stockfish. `cd` back into the `chess-openings` root directory and you'll need to copy the `stockfish.wasm` directory into `src`, using `cp -r ./public/stockfish.wasm ./src` for example. Lastly, run `npm i` and pray everything works. From there, you can run any of the scripts below from the root directory.

# Scripts

## npm start
This will start the development React server and open it in a new tab in your preferred browser.

## npm build
This will create the production bundle and place it in the `build` directory.

## npm test
This will first run ESLint, then run all of the unit tests in `src/tests/`. They will run in `watcher` mode.

## npm eject
This does some weird stuff with the `craco` and `react-scripts` configurations. This cannot be undone. Don't run this command.

## npm run compile
Any scripts you run from the command line (e.g. `src/puzzles/generatePuzzles.ts`) need to compile the TypeScript files into JavaScript and make sure Stockfish is appropriately accessible from the JS files. This command ensures that happens and compiles everything into the `tsOut` directory.

## npm run test-coverage
This runs all the unit tests outside of `watcher` mode and generates a coverage report.

## npm run gen-puzzles
This will generate puzzles and analyze every possible move the player can play for all puzzles in `PGNs.ts`. New puzzles can be added or commented out to this file as needed.
