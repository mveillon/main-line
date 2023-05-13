import './App.css';
import Opening from './components/Opening';
import Color from './chessLogic/Color';

function App() {
  return (
    <div className="App">
      <Opening 
        name="London System" 
        pgn={`
              [Event "?"]
              [Site "?"]
              [Date "????.??.??"]
              [Round "?"]
              [White "?"]
              [Black "?"]
              [Result "*"]

              1. d4 d5 2. Bf4 *
            `}
        player={Color.White}
      />
    </div>
  );
}

export default App;
