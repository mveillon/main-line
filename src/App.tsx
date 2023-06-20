import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import AnalysisBoard from './components/AnalysisBoard';

import CaroKann from './openings/Caro-Kann/CaroKann';
import AdvanceCaroBlack from './openings/Caro-Kann/Advance/AdvanceCaroBlack';
import AdvanceCaroWhite from './openings/Caro-Kann/Advance/AdvanceCaroWhite';
import ExchangeCaroBlack from './openings/Caro-Kann/Exchange/ExchangeCaroBlack';
import ExchangeCaroWhite from './openings/Caro-Kann/Exchange/ExchangeCaroWhite';
import IgnoreCaroBlack from './openings/Caro-Kann/Ignore/IgnoreCaroBlack';
import IgnoreCaroWhite from './openings/Caro-Kann/Ignore/IgnoreCaroWhite';

import London from './openings/London/London';
import LondonBlack from './openings/London/Standard/LondonBlack';
import LondonWhite from './openings/London/Standard/LondonWhite';
import Londonc4Black from './openings/London/c4/Londonc4Black';
import Londonc4White from './openings/London/c4/Londonc4white';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="analysis" element={<AnalysisBoard />} />

        <Route path="london" element={<London />}>
          <Route path="/standard/">
            <Route path="black" element={<LondonBlack />} />
            <Route path="white" element={<LondonWhite />} />
          </Route>

          <Route path="/c4/">
            <Route path="black" element={<Londonc4Black />} />
            <Route path="white" element={<Londonc4White />} />
           </Route>
        </Route>

        <Route path="caro-kann" element={<CaroKann />}>
          <Route path="/advance/">
            <Route path="black" element={<AdvanceCaroBlack />} />
            <Route path="white" element={<AdvanceCaroWhite />} />
          </Route>

          <Route path="/exchange/">
            <Route path="black" element={<ExchangeCaroBlack />} />
            <Route path="white" element={<ExchangeCaroWhite />} />
          </Route>

          <Route path="/ignore/">
            <Route path="black" element={<IgnoreCaroBlack />} />
            <Route path="white" element={<IgnoreCaroWhite />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
