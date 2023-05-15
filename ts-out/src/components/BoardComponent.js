"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./styling/BoardComponent.css");
require("./styling/global.css");
const react_1 = require("react");
const PieceComponent_1 = __importDefault(require("./PieceComponent"));
const numJS_1 = require("../utils/numJS");
const notationIndices_1 = require("../chessLogic/notationIndices");
const Color_1 = __importDefault(require("../chessLogic/Color"));
const PromotionSelector_1 = __importDefault(require("./PromotionSelector"));
const Pawn_1 = __importDefault(require("../chessLogic/pieces/Pawn"));
const BoardComponent = (props) => {
    const board = props.game.board;
    const [reversed, setReversed] = (0, react_1.useState)(props.player === Color_1.default.White);
    const [pieceSelected, setPieceSelected] = (0, react_1.useState)(null);
    const [promoting, setPromoting] = (0, react_1.useState)();
    const [legalMoves, setLegalMoves] = (0, react_1.useState)();
    const [isSelected, setIsSelected] = (0, react_1.useState)((0, numJS_1.full)((0, numJS_1.getShape)(board.board), false));
    const getInd = (i) => {
        if (reversed) {
            return board.board.length - 1 - i;
        }
        else {
            return i;
        }
    };
    const unselectPiece = () => {
        const [origI, origJ] = (0, notationIndices_1.notationToIndices)(pieceSelected.coords);
        isSelected[getInd(origI)][getInd(origJ)] = false;
        setIsSelected(isSelected);
        setPieceSelected(null);
        setLegalMoves(undefined);
    };
    const getOnClick = (i, j) => {
        return () => {
            const realI = getInd(i);
            const realJ = getInd(j);
            const p = board.board[realI][realJ];
            const playerTurn = !props.game.engineColors.includes(props.game.turn);
            const isOwnPiece = (p !== null &&
                p.color === props.game.turn &&
                (pieceSelected === null ||
                    pieceSelected.coords !== (0, notationIndices_1.indicesToNotation)(realI, realJ)));
            if (playerTurn && (pieceSelected === null || isOwnPiece)) {
                if (isOwnPiece) {
                    setPieceSelected(p);
                    setLegalMoves(p.legalMoves());
                    isSelected[i][j] = true;
                    setIsSelected(isSelected);
                }
            }
            else if (pieceSelected !== null && !isOwnPiece) {
                const toMove = pieceSelected;
                unselectPiece();
                const dest = (0, notationIndices_1.indicesToNotation)(realI, realJ);
                if (toMove.legalMoves().has(dest)) {
                    if (toMove instanceof Pawn_1.default && (dest[1] === '1' || dest[1] === '8')) {
                        setPromoting({ p: toMove, dest: dest });
                    }
                    else {
                        props.playMove(toMove.coords, dest);
                    }
                }
            }
        };
    };
    const getPromoteClick = () => {
        return (promoType) => {
            if (typeof promoting === 'undefined') {
                throw new Error('Cannot promote undefined piece');
            }
            props.playMove(promoting.p.coords, promoting.dest, promoType);
            setPromoting(undefined);
        };
    };
    const reverseBoard = () => {
        if (pieceSelected !== null) {
            unselectPiece();
        }
        setReversed(!reversed);
    };
    const inds = (0, numJS_1.arange)(board.board.length);
    return ((0, jsx_runtime_1.jsxs)("div", Object.assign({ className: 'flex-row' }, { children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("table", { children: (0, jsx_runtime_1.jsx)("tbody", { children: inds.map((i) => {
                                return ((0, jsx_runtime_1.jsx)("tr", { children: inds.map((j) => {
                                        const square = board.board[getInd(i)][getInd(j)];
                                        const selected = isSelected[i][j];
                                        const notation = (0, notationIndices_1.indicesToNotation)(getInd(i), getInd(j));
                                        const highlight = ((typeof legalMoves !== 'undefined' &&
                                            legalMoves.has(notation)) ||
                                            (props.game.board.movePointer >= 0 &&
                                                (props.game.board.lastMove.from === notation ||
                                                    props.game.board.lastMove.to === notation)));
                                        let className = (i + j) % 2 === 0 ? "white-square" : "black-square";
                                        if (highlight)
                                            className += ' highlighted';
                                        return ((0, jsx_runtime_1.jsx)("td", Object.assign({ className: className, onClick: getOnClick(i, j) }, { children: square !== null &&
                                                (0, jsx_runtime_1.jsx)(PieceComponent_1.default, { piece: square, selected: selected }) }), j));
                                    }) }, i));
                            }) }) }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: reverseBoard }, { children: "Reverse board" }))] }), promoting &&
                (0, jsx_runtime_1.jsx)(PromotionSelector_1.default, { turn: props.game.turn, onSelected: getPromoteClick() })] })));
};
exports.default = BoardComponent;
