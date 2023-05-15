"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./styling/global.css");
require("./styling/PromotionSelector.css");
const blackBishop_png_1 = __importDefault(require("../assets/blackBishop.png"));
const blackKnight_png_1 = __importDefault(require("../assets/blackKnight.png"));
const blackQueen_png_1 = __importDefault(require("../assets/blackQueen.png"));
const blackRook_png_1 = __importDefault(require("../assets/blackRook.png"));
const whiteBishop_png_1 = __importDefault(require("../assets/whiteBishop.png"));
const whiteKnight_png_1 = __importDefault(require("../assets/whiteKnight.png"));
const whiteQueen_png_1 = __importDefault(require("../assets/whiteQueen.png"));
const whiteRook_png_1 = __importDefault(require("../assets/whiteRook.png"));
const Color_1 = __importDefault(require("../chessLogic/Color"));
const Bishop_1 = __importDefault(require("../chessLogic/pieces/Bishop"));
const Knight_1 = __importDefault(require("../chessLogic/pieces/Knight"));
const Queen_1 = __importDefault(require("../chessLogic/pieces/Queen"));
const Rook_1 = __importDefault(require("../chessLogic/pieces/Rook"));
const PromotionSelector = (props) => {
    let pieces;
    if (props.turn === Color_1.default.White) {
        pieces = [
            {
                img: whiteQueen_png_1.default,
                onClick() { props.onSelected(Queen_1.default); }
            },
            {
                img: whiteRook_png_1.default,
                onClick() { props.onSelected(Rook_1.default); }
            },
            {
                img: whiteBishop_png_1.default,
                onClick() { props.onSelected(Bishop_1.default); }
            },
            {
                img: whiteKnight_png_1.default,
                onClick() { props.onSelected(Knight_1.default); }
            }
        ];
    }
    else {
        pieces = [
            {
                img: blackQueen_png_1.default,
                onClick() { props.onSelected(Queen_1.default); }
            },
            {
                img: blackRook_png_1.default,
                onClick() { props.onSelected(Rook_1.default); }
            },
            {
                img: blackBishop_png_1.default,
                onClick() { props.onSelected(Bishop_1.default); }
            },
            {
                img: blackKnight_png_1.default,
                onClick() { props.onSelected(Knight_1.default); }
            }
        ];
    }
    return ((0, jsx_runtime_1.jsx)("div", Object.assign({ className: 'flex-row selector' }, { children: pieces.map(p => ((0, jsx_runtime_1.jsx)("img", { className: "piece-img", src: p.img, onClick: p.onClick }, p.img))) })));
};
exports.default = PromotionSelector;
