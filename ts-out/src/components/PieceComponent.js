"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Color_1 = __importDefault(require("../chessLogic/Color"));
require("./styling/PieceComponent.css");
require("./styling/global.css");
const react_1 = require("react");
const blackBishop_png_1 = __importDefault(require("../assets/blackBishop.png"));
const blackKing_png_1 = __importDefault(require("../assets/blackKing.png"));
const blackKnight_png_1 = __importDefault(require("../assets/blackKnight.png"));
const blackPawn_png_1 = __importDefault(require("../assets/blackPawn.png"));
const blackQueen_png_1 = __importDefault(require("../assets/blackQueen.png"));
const blackRook_png_1 = __importDefault(require("../assets/blackRook.png"));
const whiteBishop_png_1 = __importDefault(require("../assets/whiteBishop.png"));
const whiteKing_png_1 = __importDefault(require("../assets/whiteKing.png"));
const whiteKnight_png_1 = __importDefault(require("../assets/whiteKnight.png"));
const whitePawn_png_1 = __importDefault(require("../assets/whitePawn.png"));
const whiteQueen_png_1 = __importDefault(require("../assets/whiteQueen.png"));
const whiteRook_png_1 = __importDefault(require("../assets/whiteRook.png"));
/**
 * Returns a link to the image that corresponds to the given piece
 * @param piece the piece to render
 * @returns an image of that piece
 */
const pieceToSrc = (piece) => {
    const name = piece.type.name;
    const color = piece.color === Color_1.default.White ? 'white' : 'black';
    const pieces = {
        blackBishop: blackBishop_png_1.default,
        blackKing: blackKing_png_1.default,
        blackKnight: blackKnight_png_1.default,
        blackPawn: blackPawn_png_1.default,
        blackQueen: blackQueen_png_1.default,
        blackRook: blackRook_png_1.default,
        whiteBishop: whiteBishop_png_1.default,
        whiteKing: whiteKing_png_1.default,
        whiteKnight: whiteKnight_png_1.default,
        whitePawn: whitePawn_png_1.default,
        whiteQueen: whiteQueen_png_1.default,
        whiteRook: whiteRook_png_1.default
    };
    return pieces[color + name];
};
const PieceComponent = (props) => {
    const src = pieceToSrc(props.piece);
    const [style, setStyle] = (0, react_1.useState)({});
    if (props.selected) {
        window.onmousemove = (e) => {
            setStyle({
                position: 'absolute',
                zIndex: 5,
                top: e.pageY - 10,
                left: e.pageX - 10,
                pointerEvents: 'none'
            });
        };
    }
    return ((0, jsx_runtime_1.jsx)("img", { src: src, className: "piece-img", alt: 'piece', style: props.selected ? style : undefined }));
};
exports.default = PieceComponent;
