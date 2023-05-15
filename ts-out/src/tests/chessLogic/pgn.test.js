"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Board_1 = require("../../chessLogic/Board");
const parser_test_1 = require("./parser.test");
test('scholars mate 1', () => {
    const pgn = `
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "1-0"]
    
    1. e4 f6 2. d4 g5 3. Qh5# 1-0
  `;
    const b = new Board_1.Board(pgn);
    const b2 = (0, parser_test_1.setUpBoard)([
        '1. e4 f6',
        '2. d4 g5',
        '3. Qh5#'
    ]);
    expect(b.sameBoard(b2)).toBeTruthy();
});
test('scholars mate 2', () => {
    const pgn = `
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "1-0"]
    
    1. e4 f6 2. d4 g5 (what the fuck was this move) 3. Qh5# 1-0
  `;
    const b = new Board_1.Board(pgn);
    const b2 = (0, parser_test_1.setUpBoard)([
        '1. e4 f6',
        '2. d4 g5',
        '3. Qh5#'
    ]);
    expect(b.sameBoard(b2)).toBeTruthy();
});
test('draw', () => {
    const pgn = `
    [Event "?"]
    [Site "?"]
    [Date "????.??.??"]
    [Round "?"]
    [White "?"]
    [Black "?"]
    [Result "1/2-1/2"]

    1. Nf3 Nf6 2. Ng1 Ng8 3. Nf3 Nf6 4. Ng1 Ng8 1/2-1/2
  `;
    const b = new Board_1.Board(pgn);
    const b2 = (0, parser_test_1.setUpBoard)([
        '1. Nf3 Nf6',
        '2. Ng1 Ng8',
        '3. Nf3 Nf6',
        '4. Ng1 Ng8'
    ]);
    expect(b.sameBoard(b2)).toBeTruthy();
});
test('from wikipedia', () => {
    const pgn = `
    [Event "F/S Return Match"]
    [Site "Belgrade, Serbia JUG"]
    [Date "1992.11.04"]
    [Round "29"]
    [White "Fischer, Robert J."]
    [Black "Spassky, Boris V."]
    [Result "1/2-1/2"]

    1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {This opening is called the Ruy Lopez.}
    4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
    11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15. Nb1 h6 16. Bh4 c5 17. dxe5
    Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21. Nc4 Nxc4 22. Bxc4 Nb6
    23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7 27. Qe3 Qg5 28. Qxg5
    hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33. f3 Bc8 34. Kf2 Bf5
    35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5 40. Rd6 Kc5 41. Ra6
    Nf2 42. g4 Bd3 43. Re6 1/2-1/2
  `;
    const b = new Board_1.Board(pgn);
    const b2 = (0, parser_test_1.setUpBoard)([
        '1. e4 e5',
        '2. Nf3 Nc6',
        '3. Bb5 a6',
        '4. Ba4 Nf6',
        '5. O-O Be7',
        '6. Re1 b5',
        '7. Bb3 d6',
        '8. c3 O-O',
        '9. h3 Nb8',
        '10. d4 Nbd7',
        '11. c4 c6',
        '12. cxb5 axb5',
        '13. Nc3 Bb7',
        '14. Bg5 b4',
        '15. Nb1 h6',
        '16. Bh4 c5',
        '17. dxe5 Nxe4',
        '18. Bxe7 Qxe7',
        '19. exd6 Qf6',
        '20. Nbd2 Nxd6',
        '21. Nc4 Nxc4',
        '22. Bxc4 Nb6',
        '23. Ne5 Rae8',
        '24. Bxf7+ Rxf7',
        '25. Nxf7 Rxe1+',
        '26. Qxe1 Kxf7',
        '27. Qe3 Qg5',
        '28. Qxg5 hxg5',
        '29. b3 Ke6',
        '30. a3 Kd6',
        '31. axb4 cxb4',
        '32. Ra5 Nd5',
        '33. f3 Bc8',
        '34. Kf2 Bf5',
        '35. Ra7 g6',
        '36. Ra6+ Kc5',
        '37. Ke1 Nf4',
        '38. g3 Nxh3',
        '39. Kd2 Kb5',
        '40. Rd6 Kc5',
        '41. Ra6 Nf2',
        '42. g4 Bd3',
        '43. Re6 1/2-1/2'
    ]);
    expect(b.sameBoard(b2)).toBeTruthy();
});
test('from https://theweekinchess.com/a-year-of-pgn-game-files', () => {
    const pgn = `
    [Event "28th Sigeman & Co 2023"]
    [Site "Malmo SWE"]
    [Date "2023.05.05"]
    [Round "2.2"]
    [White "Gukesh, D"]
    [Black "Keymer, Vincent"]
    [Result "1-0"]
    [WhiteTitle "GM"]
    [BlackTitle "GM"]
    [WhiteElo "2730"]
    [BlackElo "2700"]
    [ECO "C78"]
    [Opening "Ruy Lopez"]
    [Variation "Moeller defence"]
    [WhiteFideId "46616543"]
    [BlackFideId "12940690"]
    [EventDate "2023.05.04"]

    1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Bc5 6. c3 b5 7. Bb3 d6 8. d4 Bb6
    9. Be3 O-O 10. Nbd2 Re8 11. h3 h6 12. Qe2 Rb8 13. Rad1 Bd7 14. Bc2 Qc8 15. Rfe1
    Qb7 16. a3 a5 17. Nf1 a4 18. Ng3 Na5 19. Nh4 Nc4 20. Bc1 d5 21. Qf3 Nd6 22. Bxh6
    dxe4 23. Qe3 gxh6 24. Qxh6 Re6 25. Ngf5 Nfe8 26. Qg5+ Kf8 27. Qh5 Nxf5 28. Nxf5
    Rg6 29. Bxe4 Qa7 30. Qh8+ Rg8 31. Qh6+ Ng7 32. Nxg7 Rxg7 33. Re3 Bg4 34. Rg3
    Bxd4 35. Rxg4 1-0
  `;
    const b = new Board_1.Board(pgn);
    const b2 = (0, parser_test_1.setUpBoard)([
        '1. e4 e5',
        '2. Nf3 Nc6',
        '3. Bb5 a6',
        '4. Ba4 Nf6',
        '5. O-O Bc5',
        '6. c3 b5',
        '7. Bb3 d6',
        '8. d4 Bb6',
        '9. Be3 O-O',
        '10. Nbd2 Re8',
        '11. h3 h6',
        '12. Qe2 Rb8',
        '13. Rad1 Bd7',
        '14. Bc2 Qc8',
        '15. Rfe1 Qb7',
        '16. a3 a5',
        '17. Nf1 a4',
        '18. Ng3 Na5',
        '19. Nh4 Nc4',
        '20. Bc1 d5',
        '21. Qf3 Nd6',
        '22. Bxh6 dxe4',
        '23. Qe3 gxh6',
        '24. Qxh6 Re6',
        '25. Ngf5 Nfe8',
        '26. Qg5+ Kf8',
        '27. Qh5 Nxf5',
        '28. Nxf5 Rg6',
        '29. Bxe4 Qa7',
        '30. Qh8+ Rg8',
        '31. Qh6+ Ng7',
        '32. Nxg7 Rxg7',
        '33. Re3 Bg4',
        '34. Rg3 Bxd4',
        '35. Rxg4'
    ]);
    expect(b.sameBoard(b2)).toBeTruthy();
});
