"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Opening_1 = __importDefault(require("../components/Opening"));
const Color_1 = __importDefault(require("../chessLogic/Color"));
const StartingPosition = () => {
    return ((0, jsx_runtime_1.jsx)(Opening_1.default, { name: 'Chess', pgn: '', player: Color_1.default.White }));
};
exports.default = StartingPosition;
