"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
class Engine {
    /**
     * A Stockfish wrapper
     * @param depth what depth to run at
     * @param numMoves how many of the best moves to return
     */
    constructor(depth, numMoves) {
        this._sf = undefined;
        this.depth = depth;
        this.numMoves = numMoves;
    }
    /**
     * Loads the Stockfish engine and initializes it
     * @returns the initialized engine
     */
    _loadEngine() {
        return __awaiter(this, void 0, void 0, function* () {
            let getSF;
            if (process.env.NODE_ENV === 'test') {
                // @ts-ignore
                const Stockfish = yield Promise.resolve().then(() => __importStar(require("../../public/stockfish.wasm")));
                getSF = Stockfish.default;
            }
            else if (typeof process.env.NODE_ENV === 'undefined') {
                // @ts-ignore
                const Stockfish = yield Promise.resolve().then(() => __importStar(require("../../../public/stockfish.wasm/stockfish")));
                getSF = Stockfish.default;
            }
            else {
                // @ts-ignore
                getSF = window.Stockfish;
            }
            return getSF().then((sf) => {
                sf.postMessage('uci');
                sf.postMessage(`setoption name multipv value ${this.numMoves}`);
                sf.postMessage('isready');
                return sf;
            });
        });
    }
    /**
     * Waits for the engine to say its ready for the next command
     */
    _waitForReady() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a, _b;
                const listener = (message) => {
                    var _a;
                    if (message.includes('readyok')) {
                        (_a = this._sf) === null || _a === void 0 ? void 0 : _a.removeMessageListener(listener);
                        resolve(undefined);
                    }
                };
                (_a = this._sf) === null || _a === void 0 ? void 0 : _a.addMessageListener(listener);
                (_b = this._sf) === null || _b === void 0 ? void 0 : _b.postMessage('isready');
            });
        });
    }
    /**
     * Gets the `nummoves` best moves from the engine in the current position
     * given by `fen`
     * @param fen the FEN of the current position
     * @returns the `numMoves` best moves in the position
     */
    getBestMoves(fen) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this._sf === 'undefined') {
                this._sf = yield this._loadEngine();
            }
            yield this._waitForReady();
            return new Promise((resolve, reject) => {
                var _a, _b, _c, _d;
                const messages = [];
                const includedMoves = new Set();
                const listener = (message) => {
                    var _a;
                    if (message.includes(`info depth ${this.depth} seldepth`)) {
                        const words = message.split(' ');
                        const moveInd = words.indexOf('pv') + 1;
                        if (!includedMoves.has(words[moveInd])) {
                            includedMoves.add(words[moveInd]);
                            messages.push({
                                move: words[moveInd],
                                score: parseInt(words[words.indexOf('cp') + 1]),
                                line: words.slice(moveInd + 1)
                            });
                        }
                    }
                    if (message.includes('bestmove')) {
                        (_a = this._sf) === null || _a === void 0 ? void 0 : _a.removeMessageListener(listener);
                        resolve(messages);
                    }
                };
                (_a = this._sf) === null || _a === void 0 ? void 0 : _a.addMessageListener(listener);
                (_b = this._sf) === null || _b === void 0 ? void 0 : _b.postMessage('ucinewgame');
                (_c = this._sf) === null || _c === void 0 ? void 0 : _c.postMessage(`position fen ${fen}`);
                (_d = this._sf) === null || _d === void 0 ? void 0 : _d.postMessage(`go depth ${this.depth}`);
            });
        });
    }
    /**
     * Closes the engine and clears all threads. Should always be called at the
     * end to prevent leaking threads and such nonsense
     */
    quit() {
        var _a;
        (_a = this._sf) === null || _a === void 0 ? void 0 : _a.postMessage('quit');
    }
}
exports.Engine = Engine;
