import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Main from '../../modules/main/index';
import Player from '../../modules/player/index';

const AppRoutes = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </HashRouter>
  );
};

export default AppRoutes;
