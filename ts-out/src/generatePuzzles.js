"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Engine_1 = require("./chessLogic/Engine");
const Game_1 = __importDefault(require("./chessLogic/Game"));
const random_1 = require("./utils/random");
const fenPGN_1 = require("./chessLogic/fenPGN");
const numJS_1 = require("./utils/numJS");
const parser_1 = require("./chessLogic/parser");
const fs_1 = require("fs");
/**
 * Generates `numPuzzles` opening puzzles from the `startPGN` and writes the FENs
 * of each to `outFile`
 * @param startPGN the position to start generating from
 * @param numPuzzles at most how many puzzles to generate. Less rich openings may
 * not generate this many
 * @param outFile where to save the output to
 * @param depth the depth to run Stockfish at
 * @param movesDeep how many moves deep to make the puzzles. Default is 10
 */
const generatePuzzles = (startPGN, numPuzzles, outFile, depth, movesDeep = 10) => __awaiter(void 0, void 0, void 0, function* () {
    const puzzles = new Set();
    const sf = new Engine_1.Engine(depth, 5);
    for (let i = 0; i < numPuzzles; i++) {
        const g = new Game_1.default(startPGN);
        const depth = (0, random_1.randInt)(1, movesDeep);
        for (let j = 0; j < depth; j++) {
            const bestMoves = yield sf.getBestMoves((0, fenPGN_1.toFEN)(g));
            let filtered = bestMoves.filter(m => m.score > 0);
            if (filtered.length === 0) {
                filtered = bestMoves;
            }
            const scores = filtered.map(m => m.score);
            const smallest = Math.min(...scores);
            const adj = smallest < 0 ? smallest : 0;
            scores[0] -= adj;
            for (let k = 1; k < scores.length; k++) {
                scores[k] += scores[k - 1] - adj;
            }
            const toPlay = (0, random_1.choice)((0, numJS_1.arange)(scores.length), scores);
            const move = filtered[toPlay];
            g.playMove(...(0, parser_1.uciToMove)(move.move));
        }
        puzzles.add((0, fenPGN_1.toFEN)(g));
        console.log(`Puzzle No. ${puzzles.size} found!`);
    }
    sf.quit();
    const toWrite = {
        puzzles: [...puzzles]
    };
    (0, fs_1.writeFile)(outFile, JSON.stringify(toWrite), err => { });
});
console.log('Starting...');
generatePuzzles('1. d4 d5 2. Bf4', 50, 'src/puzzles/London.json', 30);
