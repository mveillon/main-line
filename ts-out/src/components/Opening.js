"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Color_1 = __importDefault(require("../chessLogic/Color"));
const GameComponent_1 = __importDefault(require("./GameComponent"));
require("./styling/global.css");
function Opening(props) {
    const c = props.player === Color_1.default.White ? 'white' : 'black';
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: props.name }), (0, jsx_runtime_1.jsxs)("p", { children: ["Find the best move for ", c] }), (0, jsx_runtime_1.jsx)(GameComponent_1.default, { pgn: props.pgn, player: props.player })] }));
}
exports.default = Opening;
