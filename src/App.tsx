import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Home';
import { LondonBlack, LondonWhite } from './openings/London';
import { CaroKannBlack, CaroKannWhite } from './openings/CaroKann';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element ={<Home />} />

        <Route path="london/">
          <Route path="black" element={<LondonBlack />} />
          <Route path="white" element={<LondonWhite />} />
        </Route>

        <Route path="caro-kann/">
          <Route path="black" element={<CaroKannBlack />} />
          <Route path="white" element={<CaroKannWhite />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
